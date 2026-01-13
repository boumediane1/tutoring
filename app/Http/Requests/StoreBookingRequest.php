<?php

namespace App\Http\Requests;

use App\Rules\AvailableRoom;
use Carbon\Carbon;
use Closure;
use Illuminate\Foundation\Http\FormRequest;

class StoreBookingRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'tutor_id' => 'required|exists:tutors,id',
            'start' => [
                'required',
                'date',
                new AvailableRoom($this->input('start') ?? '', $this->input('end') ?? ''),
                function (string $attribute, mixed $value, Closure $fail) {
                    $start = Carbon::parse($value);
                    $end = Carbon::parse($this->input('end'));

                    if ($start->diffInMinutes($end) % 60 !== 0) {
                        $fail('The session must be booked in full hours.');
                    }
                },
            ],
            'end' => 'required|date|after:start',
        ];
    }
}
