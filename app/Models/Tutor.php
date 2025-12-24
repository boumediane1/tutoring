<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Tutor extends Model
{
    /** @use HasFactory<\Database\Factories\TutorFactory> */
    use HasFactory;

    protected $fillable = [
        'user_id',
    ];

    public function user(): HasOne {
        return $this->hasOne(User::class);
    }

    public function languages(): BelongsToMany {
        return $this->belongsToMany(Language::class);
    }

    public function specialities(): BelongsToMany {
        return $this->belongsToMany(Speciality::class);
    }

    public function tags(): BelongsToMany {
        return $this->belongsToMany(Tag::class);
    }
}
