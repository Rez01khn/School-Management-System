<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Exam extends Model
{
    protected $primaryKey = 'exam_id';
    protected $fillable = ['tenant_id', 'exam_name', 'year'];
}
