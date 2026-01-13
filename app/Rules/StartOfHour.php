<?php

namespace App\Rules;

use Carbon\Carbon;
use Closure;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Translation\PotentiallyTranslatedString;

class StartOfHour implements ValidationRule
{
    /**
     * Run the validation rule.
     *
     * @param  \Closure(string, ?string=): PotentiallyTranslatedString  $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        $start = Carbon::parse($value);

        if ($start->minute !== 0 || $start->second !== 0) {
            $fail('The session must start at the beginning of an hour (e.g., 10:00).');
        }
    }
}
