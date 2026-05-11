<?php
// app/Models/LogHelper.php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class LogHelper extends Model
{
    protected $fillable = ['log_id', 'nombre_ayudante'];
}