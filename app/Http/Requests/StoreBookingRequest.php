<?php

namespace App\Http\Requests;

use App\Rules\AvailableRoom;
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
                'after:now',
                new AvailableRoom,
            ],
            'end' => 'required|date|after:start',
        ];
    }
}
