<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Enrollment extends Model
{
    use HasFactory;
        public $timestamps = false;
        protected $primarykey = 'enrollment_id';
    protected $fillable = [
        'tenant_id',
        'student_id',
        'course_id',

        'enrollment_date',
    ];
}
