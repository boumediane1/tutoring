<?php

namespace App\Models;

use Database\Factories\BookingFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Booking extends Model
{
    /** @use HasFactory<BookingFactory> */
    use HasFactory;

    protected $fillable = [
        'tutor_id',
        'start',
        'end',
        'student_id',
        'status',
        'name',
        'bbb_meeting_id',
        'bbb_attendee_password',
        'bbb_moderator_password',
    ];

    protected $casts = [
        'status' => 'string',
        'start' => 'datetime',
        'end' => 'datetime',
    ];

    public function canJoin(): bool
    {
        if ($this->status !== 'confirmed') {
            return false;
        }

        $now = now();

        return $now->between($this->start, $this->end);
    }

    public function tutor(): BelongsTo
    {
        return $this->belongsTo(Tutor::class);
    }

    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class);
    }
}
