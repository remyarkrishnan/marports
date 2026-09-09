<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Registration extends Model
{
    use HasFactory;

    protected $fillable = [
        'type',
        'full_name',
        'email',
        'phone',
        'organization',
        'designation',
        'industry',
        'pass_tier',
        'message',
        'status',
    ];
}
