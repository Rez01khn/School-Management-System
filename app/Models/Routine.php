<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Routine extends Model
{
    use HasFactory;

    protected $primaryKey = 'routine_id';
    protected $fillable = ['tenant_id', 'course_id', 'teacher_id', 'day', 'start_time', 'end_time', 'room_number'];

    public function course()
    {
        return $this->belongsTo(Course::class, 'course_id');
    }

    public function teacher()
    {
        return $this->belongsTo(Teacher::class, 'teacher_id');
    }
}
