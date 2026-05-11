@extends('layouts.app')
@section('title', 'Editar Usuario')
@section('page-title', 'Editar Usuario')

@section('content')
<div class="max-w-lg">
    <div class="card">
        <form method="POST" action="{{ route('users.update', $user['id']) }}" class="space-y-4">
            @csrf @method('PUT')

            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                <input type="text" name="nombre" value="{{ old('nombre', $user['nombre']) }}"
                       class="input-field" required>
            </div>

            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Apellidos</label>
                <input type="text" name="apellidos" value="{{ old('apellidos', $user['apellidos']) }}"
                       class="input-field" required>
            </div>

            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                <input type="text" name="telefono" value="{{ old('telefono', $user['telefono']) }}"
                       class="input-field" required>
            </div>

            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Rol</label>
                <select name="rol" class="input-field">
                    <option value="director"       {{ $user['rol'] === 'director'       ? 'selected' : '' }}>Director General</option>
                    <option value="jefe_logistica" {{ $user['rol'] === 'jefe_logistica' ? 'selected' : '' }}>Jefe de Logística</option>
                    <option value="operador"       {{ $user['rol'] === 'operador'       ? 'selected' : '' }}>Operador</option>
                </select>
            </div>

            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Estatus</label>
                <select name="activo" class="input-field">
                    <option value="1" {{ $user['activo'] ? 'selected' : '' }}>Activo</option>
                    <option value="0" {{ !$user['activo'] ? 'selected' : '' }}>Inactivo</option>
                </select>
            </div>

            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                    Nueva contraseña
                    <span class="text-gray-400 font-normal">(dejar vacío para no cambiar)</span>
                </label>
                <input type="password" name="password" class="input-field" placeholder="••••••••">
            </div>

            <div class="flex gap-3 pt-2">
                <button type="submit" class="btn-primary">Guardar cambios</button>
                <a href="{{ route('users.index') }}" class="btn-secondary">Cancelar</a>
            </div>
        </form>
    </div>
</div>
@endsection