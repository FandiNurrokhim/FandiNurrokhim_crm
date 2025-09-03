<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Portfolio extends Model
{
    protected $fillable = ['name', 'description_id', 'description_en', 'is_active'];

    public function images()
    {
        return $this->hasMany(PortfolioImage::class);
    }

    public function techUsed()
    {
        return $this->belongsToMany(TechUsed::class, 'portfolio_tech_used');
    }
}