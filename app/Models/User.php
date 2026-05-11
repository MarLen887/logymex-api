<?php
// app/Models/User.php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, SoftDeletes;

    protected $fillable = [
        'nombre',
        'apellidos',
        'telefono',
        'password',
        'rol',
        'activo',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'activo' => 'boolean',
    ];

    // ─── Helpers de rol ───────────────────────────────────────────
    public function isDirector(): bool
    {
        return $this->rol === 'director';
    }

    public function isJefeLogistica(): bool
    {
        return $this->rol === 'jefe_logistica';
    }

    public function isOperador(): bool
    {
        return $this->rol === 'operador';
    }

    // Acceso total: director o jefe
    public function hasFullAccess(): bool
    {
        return in_array($this->rol, ['director', 'jefe_logistica']);
    }

    
    // ─── Relaciones ───────────────────────────────────────────────
    public function logs()
    {
        return $this->hasMany(Log::class, 'operator_id');
    }

    public function inventoryItems()
    {
        return $this->hasMany(InventoryItem::class, 'registrado_por');
    }

    public function documents()
    {
        return $this->hasMany(Document::class, 'subido_por');
    }
}