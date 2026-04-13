<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Student extends Model
{
    use HasFactory;
        public $timestamps = false;
        protected $primarykey = 'student_id';
    protected $fillable = [
        'tenant_id',
        'first_name',
        'last_name',
        'grade',
    ];
}
