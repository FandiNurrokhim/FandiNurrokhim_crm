<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Approval extends Model
{
    use HasFactory;

    protected $fillable = [
        'deal_id',
        'approved_by',
        'status',
        'reason',
        'decided_at',
    ];

    public function deal()
    {
        return $this->belongsTo(Deal::class);
    }

    public function approvedBy()
    {
        return $this->belongsTo(User::class, 'approved_by');
    }
}
