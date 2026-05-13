<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Notice extends Model
{
    protected $primaryKey = 'notice_id';
    protected $fillable = ['tenant_id', 'title', 'message', 'target_audience', 'expiry_date'];
}
