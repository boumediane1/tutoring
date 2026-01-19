<?php

namespace Database\Factories;

use App\Models\Booking;
use App\Models\Student;
use App\Models\Tutor;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Invoice>
 */
class InvoiceFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'booking_id' => Booking::factory(),
            'student_id' => Student::factory(),
            'tutor_id' => Tutor::factory(),
            'amount' => $this->faker->randomFloat(2, 20, 100),
            'status' => 'paid',
        ];
    }
}
