<?php

namespace App\Rules;

use App\Models\Booking;
use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

readonly class AvailableRoom implements ValidationRule
{
    /**
     * Run the validation rule.
     *
     * @param  \Closure(string, ?string=): \Illuminate\Translation\PotentiallyTranslatedString  $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        $exists = Booking::query()
            ->where('tutor_id', request('tutor_id'))
            ->where('start', '<', request('end'))
            ->where('end', '>', request('start'))
            ->exists();

        if ($exists) {
            $fail('you cannot do that');
        }
    }
}
