<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Language extends Model
{
    protected $fillable = [
        'language',
    ];

    public $timestamps = false;

    public function tutors(): BelongsToMany
    {
        return $this->belongsToMany(Tutor::class);
    }
}
