<?php
// app/Http/Controllers/Api/FileController.php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\EvidenceFile;
use App\Models\Log;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class FileController extends Controller
{
    /**
     * POST /api/logs/{log}/files
     * Subir evidencia fotográfica vinculada a una bitácora (req. 10)
     */
    public function store(Request $request, Log $log): JsonResponse
    {
        $user = $request->user();

        // Solo el operador dueño de la bitácora o directivos pueden subir evidencia
        if ($user->isOperador() && $log->operator_id !== $user->id) {
            return response()->json(['message' => 'No tienes permiso para agregar evidencia a esta bitácora.'], 403);
        }

        $request->validate([
            'archivos'   => 'required|array|min:1|max:10',
            'archivos.*' => 'file|mimes:jpg,jpeg,png,pdf|max:10240', // 10MB c/u
        ]);

        $archivosGuardados = [];

        foreach ($request->file('archivos') as $file) {
            $fileName = time() . '_' . $file->getClientOriginalName();
            $path     = $file->storeAs("evidence/{$log->id}", $fileName, 'local');

            $evidencia = EvidenceFile::create([
                'log_id'         => $log->id,
                'archivo_path'   => $path,
                'archivo_nombre' => $file->getClientOriginalName(),
                'mime_type'      => $file->getMimeType(),
                'tamano_bytes'   => $file->getSize(),
                'url_nube'       => null, // Se actualiza cuando se sube a nube externa
            ]);

            $archivosGuardados[] = $evidencia;
        }

        return response()->json([
            'message' => count($archivosGuardados) . ' evidencia(s) guardada(s).',
            'data'    => $archivosGuardados,
        ], 201);
    }

    /**
     * GET /api/logs/{log}/files/{file}/download
     */
    public function download(Log $log, EvidenceFile $file)
    {
        if ($file->log_id !== $log->id) {
            return response()->json(['message' => 'Evidencia no pertenece a esta bitácora.'], 404);
        }

        $rutaAbsoluta = storage_path('app/' . $file->archivo_path);

        if (!file_exists($rutaAbsoluta)) {
            return response()->json(['message' => 'Archivo no encontrado en el servidor.'], 404);
        }

        return response()->download($rutaAbsoluta, $file->archivo_nombre);
    }


    /**
     * DELETE /api/logs/{log}/files/{file}
     */
    public function destroy(Request $request, Log $log, EvidenceFile $file): JsonResponse
    {
        if (!$request->user()->hasFullAccess()) {
            return response()->json(['message' => 'No autorizado.'], 403);
        }

        Storage::disk('local')->delete($file->archivo_path);
        $file->delete();

        return response()->json(['message' => 'Evidencia eliminada.']);
    }
}
