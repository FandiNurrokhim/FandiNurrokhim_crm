<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'price',
        'stock',
    ];

    public function deals()
    {
        return $this->hasMany(Deal::class);
    }

    public function customerServices()
    {
        return $this->hasMany(CustomerService::class);
    }
}
