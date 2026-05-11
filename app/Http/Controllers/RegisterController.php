<?php
// app/Http/Controllers/RegisterController.php

namespace App\Http\Controllers;

use App\Services\ApiService;
use Illuminate\Http\Request;

class RegisterController extends Controller
{
    public function __construct(private ApiService $api) {}

    public function show()
    {
        if (session('api_token')) {
            return redirect()->route('dashboard');
        }
        return view('auth.register');
    }

    public function store(Request $request)
    {
        $request->validate([
            'nombre'                => 'required|string|max:100',
            'apellidos'             => 'required|string|max:150',
            'telefono'              => 'required|string|max:15',
            'password'              => 'required|string|min:8|confirmed',
            'rol'                   => 'required|in:director,jefe_logistica,operador',
        ]);

        $response = $this->api->createUser([
            'nombre'    => $request->nombre,
            'apellidos' => $request->apellidos,
            'telefono'  => $request->telefono,
            'password'  => $request->password,
            'rol'       => $request->rol,
        ]);

        if ($response->successful()) {
            return redirect()->route('login')
                             ->with('success', 'Cuenta creada. Ahora puedes iniciar sesión.');
        }

        $errors = $response->json('errors', []);
        $message = $response->json('message', 'Error al crear la cuenta.');

        return back()->withErrors(['registro' => $message])->withInput();
    }
}
