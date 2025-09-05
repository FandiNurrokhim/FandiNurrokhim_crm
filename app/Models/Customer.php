<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Customer extends Model
{
    use HasFactory;

    protected $fillable = [
        'owner_id',
        'lead_id',
        'name',
        'contact',
        'address',
    ];

    public function owner() {
        return $this->belongsTo(User::class, 'owner_id');
    }

    public function lead() {
        return $this->belongsTo(Lead::class, 'lead_id');
    }

    public function services()
    {
        return $this->hasMany(CustomerService::class);
    }
}
