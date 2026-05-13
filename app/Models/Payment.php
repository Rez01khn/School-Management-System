<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    protected $primaryKey = 'payment_id';
    protected $fillable = ['tenant_id', 'student_id', 'title', 'amount', 'due_date', 'status', 'paid_amount'];

    public function student()
    {
        return $this->belongsTo(Student::class, 'student_id');
    }
}
