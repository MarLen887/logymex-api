<?php
// app/Models/Client.php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Client extends Model
{
    use SoftDeletes;
    protected $fillable = ['empresa', 'domicilio_fiscal', 'contacto', 'telefono_contacto'];

    public function logs() { return $this->hasMany(Log::class); }
}