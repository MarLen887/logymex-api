<?php
// app/Models/Log.php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Log extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'client_id',
        'unit_id',
        'operator_id',
        'tipo_residuo',
        'clasificacion',
        'peso_kg',
        'volumen_litros',
        'direccion_recoleccion',
        'estatus',
        'fecha_recoleccion',
        'fecha_entrega',
        'sincronizado',
        'sincronizado_en',
        'notas',
    ];

    protected $casts = [
        'fecha_recoleccion' => 'datetime',
        'fecha_entrega'     => 'datetime',
        'sincronizado_en'   => 'datetime',
        'sincronizado'      => 'boolean',
        'peso_kg'           => 'float',
        'volumen_litros'    => 'float',
    ];
    

    // ─── Relaciones ───────────────────────────────────────────────
    public function client()
    {
        return $this->belongsTo(Client::class);
    }

    public function unit()
    {
        return $this->belongsTo(Unit::class);
    }

    public function operator()
    {
        return $this->belongsTo(User::class, 'operator_id');
    }

    public function helpers()
    {
        return $this->hasMany(LogHelper::class);
    }

    public function evidenceFiles()
    {
        return $this->hasMany(EvidenceFile::class);
    }
}