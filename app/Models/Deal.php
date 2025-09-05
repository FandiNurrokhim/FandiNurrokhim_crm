<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Deal extends Model
{
    use HasFactory;
    protected $fillable = [
        'owner_id',
        'lead_id',
        'customer_id',
        'title',
        'status',
        'notes',
        'total_amount',
        'started_at',
        'ended_at',
    ];

    public function owner()
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    public function lead()
    {
        return $this->belongsTo(Lead::class);
    }

    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

    public function products()
    {
        return $this->belongsToMany(Product::class, 'deal_products')
            ->withPivot(['qty', 'negotiated_price', 'subtotal']);
    }

    public function approvals()
    {
        return $this->hasMany(Approval::class);
    }
}
