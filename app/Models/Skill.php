<?php

namespace App\Models;

use Illuminate\Support\Str;
use Illuminate\Database\Eloquent\Model;

class Skill extends Model
{
    protected $fillable = ['name', 'slug', 'image', 'is_active'];

    protected static function booted()
    {
        static::creating(function ($skill) {
            $skill->slug = Str::slug($skill->name);
        });

        static::updating(function ($skill) {
            if ($skill->isDirty('name')) {
                $skill->slug = Str::slug($skill->name);
            }
        });
    }
    public function portfolios()
    {
        return $this->belongsToMany(Portfolio::class, 'portfolio_skill');
    }
}
