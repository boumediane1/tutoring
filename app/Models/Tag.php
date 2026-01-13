<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Tag extends Model
{
    protected $fillable = ['title', 'speciality_id'];

    public $timestamps = false;

    public function speciality(): BelongsTo
    {
        return $this->belongsTo(Speciality::class);
    }
}
