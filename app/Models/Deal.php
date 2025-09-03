<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Deal extends Model
{
    use HasFactory;
    protected $fillable = [
        'customer_id',
        'product_id',
        'status',
        'started_at',
        'ended_at',
    ];

    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function approvals()
    {
        return $this->hasMany(Approval::class);
    }
}
