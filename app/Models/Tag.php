<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Tag extends Model
{
    public function speciality(): BelongsTo
    {
        return $this->belongsTo(Speciality::class);
    }
}
