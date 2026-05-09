<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Attendance extends Model
{
    protected $primaryKey = 'attendance_id';
    protected $fillable = ['tenant_id', 'student_id', 'course_id', 'attendance_date', 'status'];
}
