<?php

use App\Models\Booking;
use App\Models\Student;
use App\Models\Tutor;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

it('shows sessions for a student', function () {
    $user = User::factory()->create(['role' => 'student']);
    $student = Student::factory()->create(['user_id' => $user->id]);
    $tutor = Tutor::factory()->create();

    // Confirmed booking
    Booking::factory()->create([
        'student_id' => $student->id,
        'tutor_id' => $tutor->id,
        'status' => 'confirmed',
    ]);

    // Pending booking (should not show in sessions)
    Booking::factory()->create([
        'student_id' => $student->id,
        'tutor_id' => $tutor->id,
        'status' => 'pending',
    ]);

    $response = $this->actingAs($user)->get(route('sessions.index'));

    $response->assertStatus(200);
    $response->assertInertia(fn (Assert $page) => $page
        ->component('sessions/index')
        ->has('sessions', 1, fn (Assert $page) => $page
            ->has('id')
            ->has('name')
            ->has('start')
            ->has('end')
            ->has('duration')
            ->has('tutor.name')
            ->has('tutor.image')
            ->has('student.name')
            ->has('student.image')
            ->has('documents_count')
            ->etc()
        )
    );
});

it('shows sessions for a tutor', function () {
    $user = User::factory()->create(['role' => 'tutor']);
    $tutor = Tutor::factory()->create(['user_id' => $user->id]);
    $student = Student::factory()->create();

    // Confirmed booking
    Booking::factory()->create([
        'student_id' => $student->id,
        'tutor_id' => $tutor->id,
        'status' => 'confirmed',
    ]);

    $response = $this->actingAs($user)->get(route('sessions.index'));

    $response->assertStatus(200);
    $response->assertInertia(fn (Assert $page) => $page
        ->component('sessions/index')
        ->has('sessions', 1, fn (Assert $page) => $page
            ->has('id')
            ->has('name')
            ->has('start')
            ->has('end')
            ->has('duration')
            ->has('tutor.name')
            ->has('tutor.image')
            ->has('student.name')
            ->has('student.image')
            ->has('documents_count')
            ->etc()
        )
    );
});
