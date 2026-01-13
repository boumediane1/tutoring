<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Booking extends Model
{
    /** @use HasFactory<\Database\Factories\BookingFactory> */
    use HasFactory;

    protected $fillable = [
        'tutor_id',
        'start',
        'end',
        'student_id',
        'status',
    ];

    protected $casts = [
        'status' => 'string',
    ];
}
