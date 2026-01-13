<?php

namespace App\Rules;

use Carbon\Carbon;
use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class FullHours implements ValidationRule
{
    public function __construct(protected ?string $endTime) {}

    /**
     * Run the validation rule.
     *
     * @param  \Closure(string, ?string=): \Illuminate\Translation\PotentiallyTranslatedString  $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if (! $value || ! $this->endTime) {
            return;
        }

        $start = Carbon::parse($value);
        $end = Carbon::parse($this->endTime);

        if ($start->diffInMinutes($end) % 60 !== 0) {
            $fail('The session must be booked in full hours.');
        }
    }
}
