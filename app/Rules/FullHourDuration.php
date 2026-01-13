<?php

namespace App\Rules;

use Carbon\Carbon;
use Closure;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Translation\PotentiallyTranslatedString;

class FullHourDuration implements ValidationRule
{
    /**
     * Run the validation rule.
     *
     * @param  \Closure(string, ?string=): PotentiallyTranslatedString  $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        $start = Carbon::parse($value);
        $end = Carbon::parse(request('end'));

        if ($start->diffInMinutes($end) % 60 !== 0) {
            $fail('The session must be booked in full hours.');
        }
    }
}
