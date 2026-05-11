<?php
// database/seeders/UserSeeder.php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Director General
        User::create([
            'nombre'    => 'Heriberto',
            'apellidos' => 'Robles Rivera',
            'telefono'  => '2221000001',
            'password'  => Hash::make('Director2026!'),
            'rol'       => 'director',
        ]);

        // Jefe de Logística
        User::create([
            'nombre'    => 'Ismael',
            'apellidos' => 'Barranco García',
            'telefono'  => '2221000002',
            'password'  => Hash::make('Jefe2026!'),
            'rol'       => 'jefe_logistica',
        ]);

        // Operador de prueba
        User::create([
            'nombre'    => 'Ángel Fernando',
            'apellidos' => 'Alejo Díaz',
            'telefono'  => '2221000003',
            'password'  => Hash::make('Op2026!'),
            'rol'       => 'operador',
        ]);
    }
}