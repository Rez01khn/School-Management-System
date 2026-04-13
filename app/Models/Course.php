<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Course extends Model
{   
        use HasFactory;
        public $timestamps = false;
        protected $primarykey = 'course_id';
    protected $fillable = [
        'tenant_id',
        'course_name',
        'teacher_id',
    ];
}
