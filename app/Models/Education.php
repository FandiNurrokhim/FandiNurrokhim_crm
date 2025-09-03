<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Education extends Model
{
    protected $fillable = [
        'institution', 'image', 'degree', 'major', 'start_date', 'end_date', 'description_id', 'description_en', 'is_active'
    ];
}