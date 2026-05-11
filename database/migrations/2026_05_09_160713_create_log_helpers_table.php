<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        // Actor 4: Ayudante. No tiene cuenta pero queda registrado
        Schema::create('log_helpers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('log_id')->constrained('logs')->onDelete('cascade');
            $table->string('nombre_ayudante', 200);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('log_helpers');
    }
};