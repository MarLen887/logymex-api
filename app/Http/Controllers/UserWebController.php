<?php
// app/Http/Controllers/UserWebController.php

namespace App\Http\Controllers;

use App\Services\ApiService;
use Illuminate\Http\Request;


class UserWebController extends Controller
{
    public function __construct(private ApiService $api) {}

    public function index()
    {
        $users = $this->api->getUsers()->json('data') ?? [];
        return view('users.index', compact('users'));
    }

    public function create()
    {
        return view('users.create');
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'nombre'    => 'required|string',
            'apellidos' => 'required|string',
            'telefono'  => 'required|string',
            'password'  => 'required|string|min:8|confirmed',
            'rol'       => 'required|in:director,jefe_logistica,operador',
        ]);

        $response = $this->api->createUser($data);

        if ($response->successful()) {
            return redirect()->route('users.index')->with('success', 'Usuario creado.');
        }

        return back()->withErrors(['registro' => $response->json('message', 'Error al crear.')])->withInput();
    }

    public function edit(int $id)
    {
        $users = $this->api->getUsers()->json('data') ?? [];
        $user  = collect($users)->firstWhere('id', $id);

        if (!$user) {
            return redirect()->route('users.index')->with('error', 'Usuario no encontrado.');
        }

        return view('users.edit', compact('user'));
    }

    public function update(Request $request, int $id)
    {
        $data = $request->validate([
            'nombre'    => 'required|string|max:100',
            'apellidos' => 'required|string|max:150',
            'telefono'  => 'required|string|max:15',
            'rol'       => 'required|in:director,jefe_logistica,operador',
            'activo'    => 'required|in:0,1',
            'password'  => 'nullable|string|min:8',
        ]);

        $data['activo'] = (bool) $data['activo'];

        if (empty($data['password'])) {
            unset($data['password']);
        }

        $response = $this->api->updateUser($id, $data);

        if ($response->successful()) {
            return redirect()->route('users.index')->with('success', 'Usuario actualizado.');
        }

        return back()->with('error', 'Error al actualizar.')->withInput();
    }

    public function destroy(int $id)
    {
        $this->api->deleteUser($id);
        return redirect()->route('users.index')->with('success', 'Usuario dado de baja.');
    }
}