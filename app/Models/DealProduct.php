<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class DealProduct extends Model
{
    use HasFactory;
    protected $fillable = [
        'owner_id',
        'lead_id',
        'customer_id',
        'title',
        'status',
        'total_amount',
        'notes',
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
