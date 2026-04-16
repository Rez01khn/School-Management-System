<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Teacher extends Model
{
    use HasFactory;

    public $timestamps = false;
    protected $primaryKey = 'teacher_id'; // Corrected property name

    protected $fillable = [
        'tenant_id',
        'first_name',
        'last_name',
        'subject',
    ];
}
