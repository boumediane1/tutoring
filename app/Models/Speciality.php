<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Speciality extends Model
{
    protected $fillable = ['title'];

    public $timestamps = false;

    public function tags(): HasMany
    {
        return $this->hasMany(Tag::class);
    }
}
