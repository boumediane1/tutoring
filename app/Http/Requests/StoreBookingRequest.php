<?php

namespace App\Http\Requests;

use App\Rules\AvailableRoom;
use App\Rules\FullHourDuration;
use App\Rules\StartOfHour;
use Illuminate\Contracts\Validation\ValidationRule;
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
     * @return array<string, ValidationRule|array|string>
     */
    public function rules(): array
    {
        return [
            'tutor_id' => 'required|exists:tutors,id',
            'start' => [
                'required',
                'date',
                new AvailableRoom,
                new StartOfHour,
                new FullHourDuration,
            ],
            'end' => 'required|date|after:start',
        ];
    }
}
