<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('logs', function (Blueprint $table) {
            $table->id();
            // Relaciones
            $table->foreignId('client_id')->constrained('clients');
            $table->foreignId('unit_id')->constrained('units');
            $table->foreignId('operator_id')->constrained('users');
            // Datos del residuo (NOM-087 y NOM-052)
            $table->string('tipo_residuo', 150);
            // Clasificación: patologico | punzocortante | inflamable |
            //                corrosivo | reactivo | explosivo | toxico | biologico
            $table->enum('clasificacion', [
                'patologico',
                'punzocortante',
                'sangre_derivados',
                'no_anatomico',
                'cultivos_cepas',
                'corrosivo',
                'reactivo',
                'explosivo',
                'toxico',
                'inflamable'
            ]);
            $table->decimal('peso_kg', 8, 2)->nullable();
            $table->decimal('volumen_litros', 8, 2)->nullable();
            $table->string('direccion_recoleccion', 300);
            // Estatus de la bitácora
            $table->enum('estatus', ['pendiente', 'en_proceso', 'completado', 'cancelado'])
                  ->default('pendiente');
            // Sello de tiempo (req. RI-2)
            $table->timestamp('fecha_recoleccion')->nullable();
            $table->timestamp('fecha_entrega')->nullable();
            // Flag de sincronización offline (req. 7 y 14)
            $table->boolean('sincronizado')->default(false);
            $table->timestamp('sincronizado_en')->nullable();
            $table->text('notas')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('logs');
    }
};