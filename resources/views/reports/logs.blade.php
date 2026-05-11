{{-- resources/views/reports/logs.blade.php --}}
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: Arial, sans-serif; font-size: 11px; }
        h1   { color: #2e7d32; font-size: 16px; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        th   { background: #2e7d32; color: white; padding: 6px; text-align: left; }
        td   { padding: 5px; border-bottom: 1px solid #ddd; }
        tr:nth-child(even) { background: #f5f5f5; }
        .header { display: flex; justify-content: space-between; margin-bottom: 10px; }
    </style>
</head>
<body>
    <div class="header">
        <div>
            <h1>LOGYMEX Ambiental — Reporte de Bitácoras</h1>
            <p>Generado: {{ $fecha }}</p>
        </div>
    </div>
    <table>
        <thead>
            <tr>
                <th>ID</th><th>Cliente</th><th>Clasificación</th>
                <th>Peso (kg)</th><th>Unidad</th><th>Operador</th>
                <th>Estatus</th><th>Fecha</th>
            </tr>
        </thead>
        <tbody>
            @foreach($logs as $log)
            <tr>
                <td>{{ $log->id }}</td>
                <td>{{ $log->client->empresa ?? 'N/A' }}</td>
                <td>{{ ucfirst($log->clasificacion) }}</td>
                <td>{{ $log->peso_kg ?? '—' }}</td>
                <td>{{ $log->unit->placa ?? 'N/A' }}</td>
                <td>{{ $log->operator->nombre }} {{ $log->operator->apellidos }}</td>
                <td>{{ ucfirst($log->estatus) }}</td>
                <td>{{ $log->fecha_recoleccion?->format('d/m/Y') }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>
    <p style="margin-top:15px; color:#666;">
        Total de registros: {{ $logs->count() }} |
        Kg totales: {{ number_format($logs->sum('peso_kg'), 2) }} kg
    </p>
</body>
</html>