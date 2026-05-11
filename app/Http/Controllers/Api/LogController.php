<?php
// app/Http/Controllers/Api/LogController.php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Log;
use App\Models\LogHelper;
use App\Models\Unit;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class LogController extends Controller
{
    /**
     * GET /api/logs
     * Director/Jefe: ven todas las bitácoras
     * Operador: solo las propias (RC-2 + req. 7 de seguridad)
     */
    public function index(Request $request): JsonResponse
    {
        $user  = $request->user();
        $query = Log::with(['client', 'unit', 'operator', 'helpers', 'evidenceFiles'])
                    ->orderByDesc('fecha_recoleccion');

        // El operador solo ve sus propias bitácoras
        if ($user->isOperador()) {
            $query->where('operator_id', $user->id);
        }

        // Filtros opcionales
        if ($request->filled('estatus')) {
            $query->where('estatus', $request->estatus);
        }
        if ($request->filled('fecha_desde')) {
            $query->whereDate('fecha_recoleccion', '>=', $request->fecha_desde);
        }
        if ($request->filled('fecha_hasta')) {
            $query->whereDate('fecha_recoleccion', '<=', $request->fecha_hasta);
        }
        if ($request->filled('clasificacion')) {
            $query->where('clasificacion', $request->clasificacion);
        }

        return response()->json(['data' => $query->paginate(20)]);
    }

    /**
     * POST /api/logs
     * Operadores crean bitácoras. Director/Jefe también pueden.
     */
    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'client_id'            => 'required|exists:clients,id',
            'unit_id'              => 'required|exists:units,id',
            'tipo_residuo'         => 'required|string|max:150',
            'clasificacion'        => 'required|in:patologico,punzocortante,sangre_derivados,no_anatomico,cultivos_cepas,corrosivo,reactivo,explosivo,toxico,inflamable',
            'peso_kg'              => 'nullable|numeric|min:0',
            'volumen_litros'       => 'nullable|numeric|min:0',
            'direccion_recoleccion'=> 'required|string|max:300',
            'estatus'              => 'nullable|in:pendiente,en_proceso,completado,cancelado',
            'fecha_recoleccion'    => 'nullable|date',
            'notas'                => 'nullable|string',
            'sincronizado'         => 'nullable|boolean',
            // Ayudantes (array de nombres)
            'ayudantes'            => 'nullable|array',
            'ayudantes.*'          => 'string|max:200',
        ]);

        return DB::transaction(function () use ($data, $request) {
            // El operador_id siempre es el usuario autenticado
            $data['operator_id'] = $request->user()->id;
            $data['estatus']     = $data['estatus'] ?? 'pendiente';

            // Marcar sincronización offline
            if (isset($data['sincronizado']) && $data['sincronizado']) {
                $data['sincronizado_en'] = now();
            }

            $ayudantes = $data['ayudantes'] ?? [];
            unset($data['ayudantes']);

            $log = Log::create($data);

            // Registrar ayudantes (Actor 4)
            foreach ($ayudantes as $nombre) {
                LogHelper::create(['log_id' => $log->id, 'nombre_ayudante' => $nombre]);
            }

            // Actualizar estatus de la unidad si el log inicia en proceso
            if ($log->estatus === 'en_proceso') {
                Unit::where('id', $log->unit_id)->update(['estatus' => 'en_ruta']);
            }

            return response()->json([
                'message' => 'Bitácora registrada correctamente.',
                'data'    => $log->load(['client', 'unit', 'operator', 'helpers']),
            ], 201);
        });
    }

    /**
     * GET /api/logs/{id}
     */
    public function show(Request $request, Log $log): JsonResponse
    {
        $user = $request->user();

        // Operador solo puede ver sus propias bitácoras
        if ($user->isOperador() && $log->operator_id !== $user->id) {
            return response()->json(['message' => 'No tienes acceso a esta bitácora.'], 403);
        }

        return response()->json([
            'data' => $log->load(['client', 'unit', 'operator', 'helpers', 'evidenceFiles']),
        ]);
    }

    /**
     * PUT /api/logs/{id}
     * Solo director puede editar o eliminar (req. RG-6)
     */
    public function update(Request $request, Log $log): JsonResponse
    {
        $this->authorizeDirectorOrJefe($request);

        $data = $request->validate([
            'client_id'            => 'sometimes|exists:clients,id',
            'unit_id'              => 'sometimes|exists:units,id',
            'tipo_residuo'         => 'sometimes|string|max:150',
            'clasificacion'        => 'sometimes|in:patologico,punzocortante,sangre_derivados,no_anatomico,cultivos_cepas,corrosivo,reactivo,explosivo,toxico,inflamable',
            'peso_kg'              => 'nullable|numeric|min:0',
            'volumen_litros'       => 'nullable|numeric|min:0',
            'direccion_recoleccion'=> 'sometimes|string|max:300',
            'estatus'              => 'sometimes|in:pendiente,en_proceso,completado,cancelado',
            'fecha_recoleccion'    => 'nullable|date',
            'fecha_entrega'        => 'nullable|date',
            'notas'                => 'nullable|string',
        ]);

        $log->update($data);

        // Si el log se completa, liberar la unidad
        if (isset($data['estatus']) && $data['estatus'] === 'completado') {
            Unit::where('id', $log->unit_id)->update(['estatus' => 'libre']);
        }

        return response()->json(['message' => 'Bitácora actualizada.', 'data' => $log->fresh()]);
    }

    /**
     * DELETE /api/logs/{id}
     * Solo director (req. RG-6)
     */
    public function destroy(Request $request, Log $log): JsonResponse
    {
        $this->authorizeDirectorOnly($request);
        $log->delete();
        return response()->json(['message' => 'Bitácora eliminada correctamente.']);
    }

    /**
     * POST /api/logs/sync
     * Sincronización masiva de bitácoras offline (req. 7 y 14)
     */
    public function syncOffline(Request $request): JsonResponse
    {
        $request->validate([
            'bitacoras'   => 'required|array|min:1',
            'bitacoras.*' => 'array',
        ]);

        $creadas = 0;
        $errores = [];

        DB::transaction(function () use ($request, &$creadas, &$errores) {
            foreach ($request->bitacoras as $index => $bitacora) {
                try {
                    $bitacora['operator_id']   = $request->user()->id;
                    $bitacora['sincronizado']   = true;
                    $bitacora['sincronizado_en']= now();

                    $ayudantes = $bitacora['ayudantes'] ?? [];
                    unset($bitacora['ayudantes']);

                    $log = Log::create($bitacora);

                    foreach ($ayudantes as $nombre) {
                        LogHelper::create(['log_id' => $log->id, 'nombre_ayudante' => $nombre]);
                    }

                    $creadas++;
                } catch (\Exception $e) {
                    $errores[] = "Bitácora #{$index}: " . $e->getMessage();
                }
            }
        });

        return response()->json([
            'message'        => "{$creadas} bitácoras sincronizadas.",
            'sincronizadas'  => $creadas,
            'errores'        => $errores,
        ], $errores ? 207 : 201);
    }

    // ─── Helpers privados ────────────────────────────────────────────
    private function authorizeDirectorOrJefe(Request $request): void
    {
        if (!$request->user()->hasFullAccess()) {
            abort(403, 'Solo directivos pueden realizar esta acción.');
        }
    }

    private function authorizeDirectorOnly(Request $request): void
    {
        if (!$request->user()->isDirector()) {
            abort(403, 'Solo el Director General puede realizar esta acción.');
        }
    }
}