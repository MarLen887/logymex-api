<?php
// app/Models/InventoryItem.php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class InventoryItem extends Model
{
    protected $fillable = [
        'nombre_residuo', 'clasificacion', 'norma_aplicable',
        'cantidad', 'unidad_medida', 'fecha_ingreso', 'fecha_salida',
        'tipo_movimiento', 'registrado_por', 'observaciones',
    ];
    protected $casts = ['fecha_ingreso' => 'date', 'fecha_salida' => 'date'];

    public function registradoPor() { return $this->belongsTo(User::class, 'registrado_por'); }
}