<?php
// app/Http/Controllers/Api/InventoryController.php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\InventoryItem;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class InventoryController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = InventoryItem::with('registradoPor:id,nombre,apellidos')
                              ->orderByDesc('created_at');

        if ($request->filled('tipo_movimiento')) {
            $query->where('tipo_movimiento', $request->tipo_movimiento);
        }
        if ($request->filled('clasificacion')) {
            $query->where('clasificacion', $request->clasificacion);
        }
        if ($request->filled('norma_aplicable')) {
            $query->where('norma_aplicable', $request->norma_aplicable);
        }

        return response()->json(['data' => $query->paginate(25)]);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'nombre_residuo'  => 'required|string|max:200',
            'clasificacion'   => 'required|in:patologico,punzocortante,sangre_derivados,no_anatomico,cultivos_cepas,corrosivo,reactivo,explosivo,toxico,inflamable',
            'norma_aplicable' => 'required|in:NOM-087,NOM-052,ambas',
            'cantidad'        => 'required|numeric|min:0',
            'unidad_medida'   => 'required|string|max:20',
            'fecha_ingreso'   => 'required|date',
            'fecha_salida'    => 'nullable|date|after_or_equal:fecha_ingreso',
            'tipo_movimiento' => 'required|in:entrada,salida',
            'observaciones'   => 'nullable|string',
        ]);

        $data['registrado_por'] = $request->user()->id;
        $item = InventoryItem::create($data);

        return response()->json(['message' => 'Movimiento de inventario registrado.', 'data' => $item], 201);
    }

    public function show(InventoryItem $inventoryItem): JsonResponse
    {
        return response()->json(['data' => $inventoryItem->load('registradoPor:id,nombre,apellidos')]);
    }

    public function update(Request $request, InventoryItem $inventoryItem): JsonResponse
    {
        $data = $request->validate([
            'nombre_residuo'  => 'sometimes|string|max:200',
            'clasificacion'   => 'sometimes|in:patologico,punzocortante,sangre_derivados,no_anatomico,cultivos_cepas,corrosivo,reactivo,explosivo,toxico,inflamable',
            'cantidad'        => 'sometimes|numeric|min:0',
            'fecha_salida'    => 'nullable|date',
            'observaciones'   => 'nullable|string',
        ]);

        $inventoryItem->update($data);
        return response()->json(['message' => 'Inventario actualizado.', 'data' => $inventoryItem]);
    }

    /**
     * GET /api/inventory/resumen
     * Resumen de existencias por clasificación
     */
    public function resumen(): JsonResponse
    {
        $resumen = InventoryItem::selectRaw(
            'clasificacion,
             SUM(CASE WHEN tipo_movimiento = "entrada" THEN cantidad ELSE 0 END) as total_entradas,
             SUM(CASE WHEN tipo_movimiento = "salida"  THEN cantidad ELSE 0 END) as total_salidas,
             COUNT(*) as movimientos'
        )
        ->groupBy('clasificacion')
        ->get();

        return response()->json(['data' => $resumen]);
    }
}