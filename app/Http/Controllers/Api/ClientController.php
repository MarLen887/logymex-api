<?php
// app/Http/Controllers/Api/ClientController.php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Client;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class ClientController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(['data' => Client::orderBy('empresa')->get()]);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'empresa'            => 'required|string|max:200',
            'domicilio_fiscal'   => 'required|string|max:300',
            'contacto'           => 'nullable|string|max:150',
            'telefono_contacto'  => 'nullable|string|max:15',
        ]);

        $client = Client::create($data);
        return response()->json(['message' => 'Cliente registrado.', 'data' => $client], 201);
    }

    public function show(Client $client): JsonResponse
    {
        return response()->json(['data' => $client]);
    }

    public function update(Request $request, Client $client): JsonResponse
    {
        // Solo director puede editar clientes (RG-8)
        if (!$request->user()->isDirector()) {
            return response()->json(['message' => 'Solo el Director puede editar clientes.'], 403);
        }

        $data = $request->validate([
            'empresa'           => 'sometimes|string|max:200',
            'domicilio_fiscal'  => 'sometimes|string|max:300',
            'contacto'          => 'nullable|string|max:150',
            'telefono_contacto' => 'nullable|string|max:15',
        ]);

        $client->update($data);
        return response()->json(['message' => 'Cliente actualizado.', 'data' => $client]);
    }

    public function destroy(Client $client): JsonResponse
    {
        $client->delete();
        return response()->json(['message' => 'Cliente eliminado.']);
    }
}