<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EventMedia extends Model
{
    protected $fillable = [
        'event_id',
        'type',
        'file_path',
        'original_filename',
        'poster_path',
        'sort_order',
    ];

    public function event(): BelongsTo
    {
        return $this->belongsTo(Event::class);
    }

    public function isVideo(): bool
    {
        return $this->type === 'video';
    }
}
