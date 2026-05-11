<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('inventory_items', function (Blueprint $table) {
            $table->id();
            $table->string('nombre_residuo', 200);
            $table->enum('clasificacion', [
                'patologico', 'punzocortante', 'sangre_derivados',
                'no_anatomico', 'cultivos_cepas', 'corrosivo',
                'reactivo', 'explosivo', 'toxico', 'inflamable'
            ]);
            // CRETI o RPBI
            $table->enum('norma_aplicable', ['NOM-087', 'NOM-052', 'ambas']);
            $table->decimal('cantidad', 10, 2)->default(0);
            $table->string('unidad_medida', 20); // kg, litros, unidades
            $table->date('fecha_ingreso');
            $table->date('fecha_salida')->nullable();
            $table->enum('tipo_movimiento', ['entrada', 'salida']);
            $table->foreignId('registrado_por')->constrained('users');
            $table->text('observaciones')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('inventory_items');
    }
};