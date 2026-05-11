<?php
// app/Models/EvidenceFile.php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class EvidenceFile extends Model
{
    protected $fillable = [
        'log_id', 'archivo_path', 'archivo_nombre',
        'mime_type', 'tamano_bytes', 'url_nube',
    ];

    public function log() { return $this->belongsTo(Log::class); }
}