<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('documents', function (Blueprint $table) {
            $table->id();
            $table->string('tipo_documento', 100); // permiso, acta, oficio, manifiesto
            $table->string('autoridad_emisora', 200);
            $table->date('fecha_expedicion');
            $table->date('fecha_vigencia')->nullable();
            $table->enum('estatus', ['vigente', 'vencido', 'revision'])->default('vigente');
            $table->string('archivo_path', 500); // ruta en storage
            $table->string('archivo_nombre', 255);
            $table->string('mime_type', 100);
            // Solo director puede subir (RN-1)
            $table->foreignId('subido_por')->constrained('users');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('documents');
    }
};