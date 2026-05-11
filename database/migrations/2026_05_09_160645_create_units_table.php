<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('units', function (Blueprint $table) {
            $table->id();
            $table->string('placa', 20)->unique();
            $table->string('marca', 80);
            $table->string('modelo', 80);
            $table->year('anio');
            // Tipo de movilidad (req. 5 y RN-2)
            $table->enum('tipo_movilidad', ['urbana', 'carretera']);
            // Estatus operativo en tiempo real (req. 5)
            $table->enum('estatus', ['libre', 'en_ruta', 'mantenimiento'])
                  ->default('libre');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('units');
    }
};