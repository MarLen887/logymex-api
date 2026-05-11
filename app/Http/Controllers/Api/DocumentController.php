<?php
// app/Http/Controllers/Api/DocumentController.php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Document;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class DocumentController extends Controller
{
    /**
     * GET /api/documents
     * Director y Jefe pueden ver documentos (RC-2)
     */
    public function index(Request $request): JsonResponse
    {
        $query = Document::with('subidoPor:id,nombre,apellidos')
            ->orderByDesc('fecha_expedicion');

        if ($request->filled('estatus')) {
            $query->where('estatus', $request->estatus);
        }
        if ($request->filled('tipo_documento')) {
            $query->where('tipo_documento', $request->tipo_documento);
        }

        return response()->json(['data' => $query->get()]);
    }

    /**
     * POST /api/documents
     * SOLO Director puede subir documentos (RN-1 y CU-3)
     */
    public function store(Request $request): JsonResponse
    {
        // RN-1: solo director
        if (!$request->user()->isDirector()) {
            return response()->json(['message' => 'Solo el Director General puede gestionar documentos oficiales.'], 403);
        }

        $request->validate([
            'tipo_documento'   => 'required|string|max:100',
            'autoridad_emisora' => 'required|string|max:200',
            'fecha_expedicion' => 'required|date',
            'fecha_vigencia'   => 'nullable|date|after_or_equal:fecha_expedicion',
            'estatus'          => 'nullable|in:vigente,vencido,revision',
            'archivo'          => 'required|file|mimes:pdf,jpg,jpeg,png|max:20480', // 20MB
        ]);

        $file     = $request->file('archivo');
        $fileName = time() . '_' . $file->getClientOriginalName();
        $path     = $file->storeAs('documents', $fileName, 'local');

        $document = Document::create([
            'tipo_documento'   => $request->tipo_documento,
            'autoridad_emisora' => $request->autoridad_emisora,
            'fecha_expedicion' => $request->fecha_expedicion,
            'fecha_vigencia'   => $request->fecha_vigencia,
            'estatus'          => $request->estatus ?? 'vigente',
            'archivo_path'     => $path,
            'archivo_nombre'   => $file->getClientOriginalName(),
            'mime_type'        => $file->getMimeType(),
            'subido_por'       => $request->user()->id,
        ]);

        return response()->json(['message' => 'Documento oficial cargado.', 'data' => $document], 201);
    }

    /**
     * GET /api/documents/{id}/download
     * Descargar documento (solo director y jefe)
     */
    public function download(Document $document)
    {
        $rutaAbsoluta = storage_path('app/' . $document->archivo_path);

        if (!file_exists($rutaAbsoluta)) {
            return response()->json(['message' => 'Archivo no encontrado.'], 404);
        }

        return response()->download($rutaAbsoluta, $document->archivo_nombre);
    }

    /**
     * DELETE /api/documents/{id}
     * Solo director puede eliminar (RN-1)
     */
    public function destroy(Request $request, Document $document): JsonResponse
    {
        if (!$request->user()->isDirector()) {
            return response()->json(['message' => 'Solo el Director General puede eliminar documentos.'], 403);
        }

        Storage::disk('local')->delete($document->archivo_path);
        $document->delete();

        return response()->json(['message' => 'Documento eliminado.']);
    }
}
