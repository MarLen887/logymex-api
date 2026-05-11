<?php
// app/Models/Document.php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Document extends Model
{
    use SoftDeletes;
    protected $fillable = [
        'tipo_documento', 'autoridad_emisora', 'fecha_expedicion',
        'fecha_vigencia', 'estatus', 'archivo_path',
        'archivo_nombre', 'mime_type', 'subido_por',
    ];
    protected $casts = ['fecha_expedicion' => 'date', 'fecha_vigencia' => 'date'];

    public function subidoPor() { return $this->belongsTo(User::class, 'subido_por'); }
}