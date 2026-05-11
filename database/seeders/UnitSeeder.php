<?php
namespace Database\Seeders;

use App\Models\Unit;
use Illuminate\Database\Seeder;

class UnitSeeder extends Seeder
{
    public function run(): void
    {
        Unit::insert([
            ['placa' => 'PUE-123-AA', 'marca' => 'Ford',    'modelo' => 'Transit',   'anio' => 2021, 'tipo_movilidad' => 'urbana',    'estatus' => 'libre'],
            ['placa' => 'PUE-456-BB', 'marca' => 'Mercedes','modelo' => 'Sprinter',  'anio' => 2020, 'tipo_movilidad' => 'urbana',    'estatus' => 'libre'],
            ['placa' => 'PUE-789-CC', 'marca' => 'Kenworth', 'modelo' => 'T370',     'anio' => 2019, 'tipo_movilidad' => 'carretera', 'estatus' => 'libre'],
            ['placa' => 'PUE-012-DD', 'marca' => 'Freightliner','modelo' => 'M2 106','anio' => 2022, 'tipo_movilidad' => 'carretera', 'estatus' => 'libre'],
        ]);
    }
}