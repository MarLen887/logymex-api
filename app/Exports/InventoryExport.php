<?php

namespace App\Exports;

use App\Models\InventoryItem;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class InventoryExport implements FromCollection, WithHeadings, WithMapping
{
    public function collection()
    {
        return InventoryItem::with('registradoPor:id,nombre,apellidos')
                            ->orderByDesc('fecha_ingreso')
                            ->get();
    }

    public function headings(): array
    {
        return [
            'ID',
            'Nombre del residuo',
            'Clasificación',
            'Norma aplicable',
            'Tipo de movimiento',
            'Cantidad',
            'Unidad de medida',
            'Fecha ingreso',
            'Fecha salida',
            'Registrado por',
            'Observaciones',
        ];
    }

    public function map($item): array
    {
        return [
            $item->id,
            $item->nombre_residuo,
            ucfirst($item->clasificacion),
            $item->norma_aplicable,
            ucfirst($item->tipo_movimiento),
            $item->cantidad,
            $item->unidad_medida,
            $item->fecha_ingreso?->format('d/m/Y') ?? '',
            $item->fecha_salida?->format('d/m/Y') ?? '',
            trim(($item->registradoPor->nombre ?? '') . ' ' . ($item->registradoPor->apellidos ?? '')),
            $item->observaciones ?? '',
        ];
    }
}