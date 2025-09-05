<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Lead extends Model
{
    use HasFactory;
    protected $fillable = [
        'owner_id',
        'name',
        'contact',
        'address',
        'needs',
        'status',
    ];

    public function owner()
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

    public function services()
    {
        return $this->hasMany(CustomerService::class);
    }

    public function deals()
    {
        return $this->hasMany(Deal::class);
    }

    public function dealProducts()
    {
        return $this->hasManyThrough(DealProduct::class, Deal::class);
    }
}
