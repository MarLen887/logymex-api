<?php
// app/Http/Controllers/Api/AuthController.php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * POST /api/login
     * Login con teléfono + nombre + apellidos (sin correo)
     */
    public function login(Request $request): JsonResponse
    {
        $request->validate([
            'telefono'  => 'required|string|max:15',
            'nombre'    => 'required|string|max:100',
            'apellidos' => 'required|string|max:150',
            'password'  => 'required|string',
        ]);

        // Buscar usuario por teléfono
        $user = User::where('telefono', $request->telefono)
                    ->where('activo', true)
                    ->first();

        // Validar nombre, apellidos y contraseña
        if (
            !$user ||
            strtolower(trim($user->nombre))    !== strtolower(trim($request->nombre)) ||
            strtolower(trim($user->apellidos)) !== strtolower(trim($request->apellidos)) ||
            !Hash::check($request->password, $user->password)
        ) {
            // RC-3: Credenciales inválidas → no generar token
            return response()->json([
                'message' => 'Las credenciales proporcionadas son incorrectas.',
            ], 401);
        }

        // Nombre del device para identificar el token (útil en móvil)
        $deviceName = $request->input('device_name', 'api_client');

        // Revocar tokens anteriores del mismo device (opcional)
        $user->tokens()->where('name', $deviceName)->delete();

        // Crear nuevo token Sanctum
        $token = $user->createToken($deviceName)->plainTextToken;

        return response()->json([
            'message' => 'Sesión iniciada correctamente.',
            'token'   => $token,
            'user'    => [
                'id'        => $user->id,
                'nombre'    => $user->nombre,
                'apellidos' => $user->apellidos,
                'telefono'  => $user->telefono,
                'rol'       => $user->rol,
            ],
        ], 200);
    }

    /**
     * POST /api/logout
     */
    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Sesión cerrada correctamente.'], 200);
    }

    /**
     * GET /api/me
     * Retorna el usuario autenticado con su rol (RC-2)
     */
    public function me(Request $request): JsonResponse
    {
        return response()->json([
            'user' => [
                'id'        => $request->user()->id,
                'nombre'    => $request->user()->nombre,
                'apellidos' => $request->user()->apellidos,
                'telefono'  => $request->user()->telefono,
                'rol'       => $request->user()->rol,
            ],
        ]);
    }
}