<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SiteSetting extends Model
{
    protected $fillable = [
        'address',
        'phone',
        'email',
        'instagram_username',
    ];

    public static function current(): self
    {
        return static::firstOrCreate(['id' => 1]);
    }

    public function whatsappLink(?string $message = null): ?string
    {
        if (! $this->phone) {
            return null;
        }

        $digits = preg_replace('/\D/', '', $this->phone);
        $number = '62'.ltrim($digits, '0');

        $link = "https://wa.me/{$number}";

        if ($message) {
            $link .= '?text='.urlencode($message);
        }

        return $link;
    }

    public function instagramLink(): ?string
    {
        if (! $this->instagram_username) {
            return null;
        }

        return 'https://instagram.com/'.ltrim(trim($this->instagram_username), '@');
    }
}
