<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Mark extends Model
{
    protected $primaryKey = 'mark_id';
    
    protected $fillable = [
        'tenant_id', 
        'exam_id', 
        'student_id', 
        'course_id', 
        'marks_obtained', 
        'total_marks'
    ];

    public function student()
    {
        return $this->belongsTo(Student::class, 'student_id');
    }

    public function course()
    {
        return $this->belongsTo(Course::class, 'course_id');
    }

    public function exam()
    {
        return $this->belongsTo(Exam::class, 'exam_id');
    }
}
