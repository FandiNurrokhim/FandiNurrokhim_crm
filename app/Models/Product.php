<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'hpp',
        'margin_percent',
        'sell_price',
        'is_active',
    ];

    protected static function booted()
    {
        static::creating(function ($product) {
            $product->sell_price = $product->hpp + ($product->hpp * ($product->margin_percent / 100));
        });
    }

    public function deals()
    {
        return $this->hasManyThrough(
            Deal::class,
            DealProduct::class,
            'product_id',
            'id',         
            'id',       
            'deal_id'    
        );
    }

    public function customerServices()
    {
        return $this->hasMany(CustomerService::class);
    }

    public function customers()
    {
        return $this->belongsToMany(Customer::class, 'customer_services');
    }

    public function isUsed()
    {
        return $this->deals()->exists() || $this->customerServices()->exists();
    }
}
