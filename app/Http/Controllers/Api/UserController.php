<?php
// app/Http/Controllers/Api/UserController.php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    public function index(): JsonResponse
    {
        $users = User::select('id', 'nombre', 'apellidos', 'telefono', 'rol', 'activo', 'created_at')
                     ->orderBy('rol')
                     ->orderBy('nombre')
                     ->get();

        return response()->json(['data' => $users]);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'nombre'    => 'required|string|max:100',
            'apellidos' => 'required|string|max:150',
            'telefono'  => 'required|string|max:15|unique:users,telefono',
            'password'  => 'required|string|min:8',
            'rol'       => 'required|in:director,jefe_logistica,operador',
        ]);

        $data['password'] = Hash::make($data['password']);
        $user = User::create($data);

        return response()->json([
            'message' => 'Usuario creado correctamente.',
            'data'    => $user->only('id', 'nombre', 'apellidos', 'telefono', 'rol'),
        ], 201);
    }

    public function show(User $user): JsonResponse
    {
        return response()->json([
            'data' => $user->only('id', 'nombre', 'apellidos', 'telefono', 'rol', 'activo', 'created_at')
        ]);
    }

    public function update(Request $request, User $user): JsonResponse
    {
        $data = $request->validate([
            'nombre'    => 'sometimes|string|max:100',
            'apellidos' => 'sometimes|string|max:150',
            'telefono'  => ['sometimes', 'string', 'max:15', Rule::unique('users')->ignore($user->id)],
            'password'  => 'sometimes|string|min:8',
            'rol'       => 'sometimes|in:director,jefe_logistica,operador',
            'activo'    => 'sometimes|boolean',
        ]);

        if (isset($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        }

        $user->update($data);

        return response()->json(['message' => 'Usuario actualizado.', 'data' => $user]);
    }

    public function destroy(User $user): JsonResponse
    {
        $user->delete();
        return response()->json(['message' => 'Usuario dado de baja correctamente.']);
    }
}