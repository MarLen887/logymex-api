<?php
// app/Models/Unit.php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Unit extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'placa',
        'marca',
        'modelo',
        'anio',
        'tipo_movilidad',
        'estatus',
    ];

    public function logs()
    {
        return $this->hasMany(Log::class);
    }

    // Scope: unidades disponibles para asignación
    public function scopeDisponibles($query)
    {
        return $query->where('estatus', 'libre');
    }
}