<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Career extends Model
{
    protected $fillable = [
        'position', 'company_logo', 'company', 'start_date', 'end_date', 'description_id', 'description_en', 'is_active'
    ];
}