<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Teacher extends Model
{
     use HasFactory;
        public $timestamps = false;
        protected $primarykey = 'tenant_id';
    protected $fillable = [
        'tenant_id',
        'address',
    ];
}
