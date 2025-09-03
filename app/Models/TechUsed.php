<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class TechUsed extends Model
{
    protected $table = 'tech_used';
    protected $fillable = ['name', 'slug', 'image', 'is_active'];

    protected static function booted()
    {
        static::creating(function ($techUsed) {
            $techUsed->slug = Str::slug($techUsed->name);
        });

        static::updating(function ($techUsed) {
            if ($techUsed->isDirty('name')) {
                $techUsed->slug = Str::slug($techUsed->name);
            }
        });
    }

    public function portfolios()
    {
        return $this->belongsToMany(Portfolio::class, 'portfolio_tech_used');
    }
}
