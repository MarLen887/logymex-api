<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('evidence_files', function (Blueprint $table) {
            $table->id();
            $table->foreignId('log_id')->constrained('logs')->onDelete('cascade');
            $table->string('archivo_path', 500);
            $table->string('archivo_nombre', 255);
            $table->string('mime_type', 100);
            $table->unsignedBigInteger('tamano_bytes')->nullable();
            // URL resultante del almacenamiento en nube (req. integración)
            $table->string('url_nube', 500)->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('evidence_files');
    }
};