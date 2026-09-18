<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Builder;

class Event extends Model
{
    protected $fillable = [
        'title',
        'category',
        'client',
        'description',
        'cover_image',
        'sort_order',
        'is_published',
    ];

    protected $casts = [
        'is_published' => 'boolean',
    ];

    public function media(): HasMany
    {
        return $this->hasMany(EventMedia::class)->orderBy('sort_order');
    }

    public function scopePublished(Builder $query): Builder
    {
        return $query->where('is_published', true);
    }

    public function scopeOrdered(Builder $query): Builder
    {
        return $query->orderBy('sort_order')->orderByDesc('created_at');
    }

    public function categoryLabel(): string
    {
        return config('portfolio.categories.'.$this->category, $this->category);
    }
}
