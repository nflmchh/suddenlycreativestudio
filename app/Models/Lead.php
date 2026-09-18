<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Lead extends Model
{
    protected $fillable = [
        'chat_conversation_id',
        'name',
        'whatsapp',
    ];

    public function conversation(): BelongsTo
    {
        return $this->belongsTo(ChatConversation::class, 'chat_conversation_id');
    }

    public function whatsappLink(): string
    {
        $digits = preg_replace('/\D/', '', $this->whatsapp);
        $number = '62'.ltrim($digits, '0');

        return "https://wa.me/{$number}";
    }
}
