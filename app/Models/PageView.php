<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PageView extends Model
{
    const UPDATED_AT = null;

    protected $fillable = [
        'session_id',
        'path',
        'referrer',
        'user_agent',
    ];
}
