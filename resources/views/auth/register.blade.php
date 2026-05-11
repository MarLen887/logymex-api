<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Registro — LOGYMEX</title>
    @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>
<body class="bg-gray-50 min-h-screen flex items-center justify-center py-10">

    <div class="w-full max-w-md">
        <div class="text-center mb-8">
            <div class="inline-flex items-center justify-center w-16 h-16 bg-primary-700 rounded-full mb-4">
                <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3
                             20a6 6 0 0112 0v1H3v-1z"/>
                </svg>
            </div>
            <h1 class="text-2xl font-bold text-gray-900">LOGYMEX Ambiental</h1>
            <p class="text-gray-500 text-sm mt-1">Crear cuenta nueva</p>
        </div>

        <div class="card">
            <h2 class="text-lg font-semibold text-gray-800 mb-6">Registro</h2>

            @if ($errors->has('registro'))
                <div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
                    {{ $errors->first('registro') }}
                </div>
            @endif

            <form method="POST" action="{{ route('register.post') }}" class="space-y-4">
                @csrf

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
                    <input type="text" name="nombre" value="{{ old('nombre') }}"
                           class="input-field" placeholder="Tu nombre" required>
                    @error('nombre')
                        <p class="text-red-500 text-xs mt-1">{{ $message }}</p>
                    @enderror
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Apellidos *</label>
                    <input type="text" name="apellidos" value="{{ old('apellidos') }}"
                           class="input-field" placeholder="Tus apellidos" required>
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Teléfono *</label>
                    <input type="text" name="telefono" value="{{ old('telefono') }}"
                           class="input-field" placeholder="10 dígitos" required>
                    @error('telefono')
                        <p class="text-red-500 text-xs mt-1">{{ $message }}</p>
                    @enderror
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Rol en la empresa *</label>
                    <select name="rol" class="input-field" required>
                        <option value="">Seleccionar rol</option>
                        <option value="director"        {{ old('rol') === 'director'        ? 'selected' : '' }}>
                            Director General
                        </option>
                        <option value="jefe_logistica"  {{ old('rol') === 'jefe_logistica'  ? 'selected' : '' }}>
                            Jefe de Logística
                        </option>
                        <option value="operador"        {{ old('rol') === 'operador'        ? 'selected' : '' }}>
                            Operador
                        </option>
                    </select>
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Contraseña *</label>
                    <input type="password" name="password"
                           class="input-field" placeholder="Mínimo 8 caracteres" required>
                    @error('password')
                        <p class="text-red-500 text-xs mt-1">{{ $message }}</p>
                    @enderror
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Confirmar contraseña *</label>
                    <input type="password" name="password_confirmation"
                           class="input-field" placeholder="Repite tu contraseña" required>
                </div>

                <button type="submit" class="btn-primary w-full mt-2">
                    Crear cuenta
                </button>
            </form>
        </div>

        <p class="text-center text-sm text-gray-500 mt-4">
            ¿Ya tienes cuenta?
            <a href="{{ route('login') }}" class="text-primary-700 hover:underline font-medium">
                Iniciar sesión
            </a>
        </p>
    </div>

</body>
</html>