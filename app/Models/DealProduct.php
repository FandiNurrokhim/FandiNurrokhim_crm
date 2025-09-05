<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class DealProduct extends Model
{
    use HasFactory;
    protected $fillable = [
        'deal_id',
        'product_id',
        'negotiated_price',
        'qty',
        'subtotal',
    ];

    public function deal()
    {
        return $this->belongsTo(Deal::class);
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
