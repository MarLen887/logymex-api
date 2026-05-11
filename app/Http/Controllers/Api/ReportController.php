<?php
// app/Http/Controllers/Api/ReportController.php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Log;
use App\Models\InventoryItem;
use App\Models\Unit;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\LogsExport;
use App\Exports\InventoryExport;


class ReportController extends Controller
{
    /**
     * GET /api/reports/dashboard
     * Estadísticas generales para el panel directivo
     */
    
    public function dashboard(): JsonResponse
    {
        return response()->json([
            'data' => [
                'total_bitacoras'        => Log::count(),
                'bitacoras_hoy'          => Log::whereDate('created_at', today())->count(),
                'bitacoras_completadas'  => Log::where('estatus', 'completado')->count(),
                'bitacoras_pendientes'   => Log::where('estatus', 'pendiente')->count(),
                'unidades_libres'        => Unit::where('estatus', 'libre')->count(),
                'unidades_en_ruta'       => Unit::where('estatus', 'en_ruta')->count(),
                'unidades_mantenimiento' => Unit::where('estatus', 'mantenimiento')->count(),
                'kg_totales_recolectados'=> Log::where('estatus', 'completado')->sum('peso_kg'),
                'residuos_por_tipo'      => Log::selectRaw('clasificacion, COUNT(*) as total')
                                              ->groupBy('clasificacion')->get(),
            ],
        ]);
    }

    /**
     * GET /api/reports/logs/export/excel
     */
    public function exportLogsExcel(Request $request)
    {
        $filters = $request->only(['fecha_desde', 'fecha_hasta', 'estatus', 'clasificacion']);
        return Excel::download(new LogsExport($filters), 'bitacoras_logymex_' . date('Ymd') . '.xlsx');
    }

    /**
     * GET /api/reports/logs/export/pdf
     */
    public function exportLogsPdf(Request $request)
    {
        $query = Log::with(['client', 'unit', 'operator'])->orderByDesc('fecha_recoleccion');

        if ($request->filled('fecha_desde')) {
            $query->whereDate('fecha_recoleccion', '>=', $request->fecha_desde);
        }
        if ($request->filled('fecha_hasta')) {
            $query->whereDate('fecha_recoleccion', '<=', $request->fecha_hasta);
        }

        $logs = $query->get();

        $pdf = Pdf::loadView('reports.logs', ['logs' => $logs, 'fecha' => now()->format('d/m/Y H:i')]);
        $pdf->setPaper('A4', 'landscape');

        return $pdf->download('bitacoras_logymex_' . date('Ymd') . '.pdf');
    }

    /**
     * GET /api/reports/inventory/export/excel
     */
    public function exportInventoryExcel()
    {
        return Excel::download(new InventoryExport(), 'inventario_logymex_' . date('Ymd') . '.xlsx');
    }
}