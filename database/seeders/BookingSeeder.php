<?php

namespace Database\Seeders;

use App\Models\Booking;
use App\Models\Student;
use App\Models\Tutor;
use Illuminate\Database\Seeder;

class BookingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $tutor = Tutor::first() ?? Tutor::factory()->create();
        $student = Student::first() ?? Student::factory()->create();

        // Confirmed bookings for this tutor
        Booking::factory()
            ->count(5)
            ->confirmed()
            ->state([
                'tutor_id' => $tutor->id,
            ])
            ->create();

        // Pending bookings for this tutor
        Booking::factory()
            ->count(5)
            ->pending()
            ->state([
                'tutor_id' => $tutor->id,
            ])
            ->create();

        // Canceled bookings for this tutor
        Booking::factory()
            ->count(3)
            ->canceled()
            ->state([
                'tutor_id' => $tutor->id,
            ])
            ->create();

        // Bookings with other tutors
        Booking::factory()
            ->count(10)
            ->create([
                'student_id' => $student->id,
            ]);
    }
}
