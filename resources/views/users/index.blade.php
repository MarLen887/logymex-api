@extends('layouts.app')
@section('title', 'Usuarios')
@section('page-title', 'Gestión de Personal')

@section('content')

<div class="flex justify-between items-center mb-6">
    <p class="text-gray-500 text-sm">Solo el Director General puede gestionar usuarios.</p>
    @if(session('user_rol') === 'director')
        <a href="{{ route('users.create') }}" class="btn-primary">+ Nuevo usuario</a>
    @endif
</div>

<div class="card overflow-hidden p-0">
    <div class="overflow-x-auto">
        <table class="w-full text-sm">
            <thead class="bg-gray-50 border-b">
                <tr class="text-left text-gray-500">
                    <th class="px-6 py-3 font-medium">ID</th>
                    <th class="px-6 py-3 font-medium">Nombre</th>
                    <th class="px-6 py-3 font-medium">Teléfono</th>
                    <th class="px-6 py-3 font-medium">Rol</th>
                    <th class="px-6 py-3 font-medium">Estatus</th>
                    @if(session('user_rol') === 'director')
                        <th class="px-6 py-3 font-medium">Acciones</th>
                    @endif
                </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
                @forelse($users as $user)
                <tr class="hover:bg-gray-50">
                    <td class="px-6 py-4 text-gray-400">#{{ $user['id'] }}</td>
                    <td class="px-6 py-4">
                        <p class="font-medium text-gray-900">{{ $user['nombre'] }} {{ $user['apellidos'] }}</p>
                        <p class="text-gray-400 text-xs">Tel: {{ $user['telefono'] }}</p>
                    </td>
                    <td class="px-6 py-4 text-gray-600">{{ $user['telefono'] }}</td>
                    <td class="px-6 py-4">
                        <span class="px-2 py-1 rounded-full text-xs font-medium
                            {{ $user['rol'] === 'director'       ? 'bg-yellow-100 text-yellow-800' :
                               ($user['rol'] === 'jefe_logistica' ? 'bg-blue-100 text-blue-800' :
                                'bg-gray-100 text-gray-700') }}">
                            {{ ucfirst(str_replace('_', ' ', $user['rol'])) }}
                        </span>
                    </td>
                    <td class="px-6 py-4">
                        <span class="{{ $user['activo'] ? 'text-green-600' : 'text-red-500' }} text-xs font-medium">
                            {{ $user['activo'] ? 'Activo' : 'Inactivo' }}
                        </span>
                    </td>
                    @if(session('user_rol') === 'director')
                    <td class="px-6 py-4">
                        <div class="flex gap-3">
                            <a href="{{ route('users.edit', $user['id']) }}"
                               class="text-blue-600 hover:underline text-xs">Editar</a>
                            <form method="POST" action="{{ route('users.destroy', $user['id']) }}"
                                  onsubmit="return confirm('¿Dar de baja a este usuario?')">
                                @csrf @method('DELETE')
                                <button class="text-red-500 hover:underline text-xs">Eliminar</button>
                            </form>
                        </div>
                    </td>
                    @endif
                </tr>
                @empty
                <tr>
                    <td colspan="6" class="px-6 py-10 text-center text-gray-400">No hay usuarios registrados</td>
                </tr>
                @endforelse
            </tbody>
        </table>
    </div>
</div>

@endsection