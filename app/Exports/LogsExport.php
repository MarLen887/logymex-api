<?php

namespace App\Exports;

use App\Models\Log;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class LogsExport implements FromCollection, WithHeadings, WithMapping
{
    public function __construct(private array $filters = []) {}

    public function collection()
    {
        $query = Log::with(['client', 'unit', 'operator']);

        if (!empty($this->filters['fecha_desde'])) {
            $query->whereDate('fecha_recoleccion', '>=', $this->filters['fecha_desde']);
        }
        if (!empty($this->filters['fecha_hasta'])) {
            $query->whereDate('fecha_recoleccion', '<=', $this->filters['fecha_hasta']);
        }
        if (!empty($this->filters['estatus'])) {
            $query->where('estatus', $this->filters['estatus']);
        }
        if (!empty($this->filters['clasificacion'])) {
            $query->where('clasificacion', $this->filters['clasificacion']);
        }

        return $query->orderByDesc('fecha_recoleccion')->get();
    }

    public function headings(): array
    {
        return [
            'ID',
            'Cliente',
            'Dirección de recolección',
            'Unidad (Placa)',
            'Operador',
            'Tipo de residuo',
            'Clasificación',
            'Peso (kg)',
            'Volumen (L)',
            'Estatus',
            'Fecha recolección',
            'Fecha entrega',
            'Sincronizado offline',
        ];
    }

    public function map($log): array
    {
        return [
            $log->id,
            $log->client->empresa ?? 'N/A',
            $log->direccion_recoleccion,
            $log->unit->placa ?? 'N/A',
            trim(($log->operator->nombre ?? '') . ' ' . ($log->operator->apellidos ?? '')),
            $log->tipo_residuo,
            ucfirst($log->clasificacion),
            $log->peso_kg ?? '',
            $log->volumen_litros ?? '',
            ucfirst($log->estatus),
            $log->fecha_recoleccion?->format('d/m/Y H:i') ?? '',
            $log->fecha_entrega?->format('d/m/Y H:i') ?? '',
            $log->sincronizado ? 'Sí' : 'No',
        ];
    }
}