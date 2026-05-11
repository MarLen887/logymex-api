<?php
// app/Http/Controllers/Api/UnitController.php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Unit;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class UnitController extends Controller
{
    /**
     * GET /api/units
     * Disponibilidad en tiempo real (CU-2)
     */
    public function index(Request $request): JsonResponse
    {
        $query = Unit::orderBy('tipo_movilidad')->orderBy('placa');

        if ($request->filled('estatus')) {
            $query->where('estatus', $request->estatus);
        }
        if ($request->filled('tipo_movilidad')) {
            $query->where('tipo_movilidad', $request->tipo_movilidad);
        }

        return response()->json(['data' => $query->get()]);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'placa'          => 'required|string|max:20|unique:units,placa',
            'marca'          => 'required|string|max:80',
            'modelo'         => 'required|string|max:80',
            'anio'           => 'required|integer|min:2000|max:' . (date('Y') + 1),
            'tipo_movilidad' => 'required|in:urbana,carretera',
            'estatus'        => 'nullable|in:libre,en_ruta,mantenimiento',
        ]);

        $unit = Unit::create($data);
        return response()->json(['message' => 'Unidad registrada.', 'data' => $unit], 201);
    }

    public function show(Unit $unit): JsonResponse
    {
        return response()->json(['data' => $unit->load('logs')]);
    }

    /**
     * PATCH /api/units/{id}/estatus
     * Actualizar solo el estatus de una unidad (RG-5)
     */
    public function updateEstatus(Request $request, Unit $unit): JsonResponse
    {
        $request->validate([
            'estatus' => 'required|in:libre,en_ruta,mantenimiento',
        ]);

        $unit->update(['estatus' => $request->estatus]);

        return response()->json([
            'message' => 'Estatus de unidad actualizado.',
            'data'    => $unit,
        ]);
    }

    public function update(Request $request, Unit $unit): JsonResponse
    {
        $data = $request->validate([
            'placa'          => ['sometimes','string','max:20', Rule::unique('units')->ignore($unit->id)],
            'marca'          => 'sometimes|string|max:80',
            'modelo'         => 'sometimes|string|max:80',
            'anio'           => 'sometimes|integer|min:2000|max:' . (date('Y') + 1),
            'tipo_movilidad' => 'sometimes|in:urbana,carretera',
            'estatus'        => 'sometimes|in:libre,en_ruta,mantenimiento',
        ]);

        $unit->update($data);
        return response()->json(['message' => 'Unidad actualizada.', 'data' => $unit]);
    }

    public function destroy(Unit $unit): JsonResponse
    {
        $unit->delete();
        return response()->json(['message' => 'Unidad eliminada.']);
    }
}