<?php

use App\Models\Student;
use App\Models\Tutor;
use App\Models\User;

test('guests are redirected to the login page', function () {
    $this->get(route('student.dashboard'))->assertRedirect(route('login'));
});

test('authenticated students can visit the dashboard', function () {
    $user = User::factory()->create(['role' => 'student']);
    $student = Student::factory()->create(['user_id' => $user->id]);

    $this->actingAs($user);
    $tutor = Tutor::factory()->create();
    $student->bookings()->create([
        'tutor_id' => $tutor->id,
        'start' => now()->addDay(),
        'end' => now()->addDay()->addHour(),
        'status' => 'confirmed',
    ]);

    $this->get(route('student.dashboard'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('student/dashboard')
            ->has('stats')
            ->has('counts')
            ->has('recentTutors', 1)
        );
});

test('authenticated students can visit the tutors index', function () {
    $user = User::factory()->create(['role' => 'student']);
    Student::factory()->create(['user_id' => $user->id]);

    $this->actingAs($user);

    $this->get(route('student.tutors.index'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('student/tutors/index')
            ->has('tutors')
            ->has('specialities')
            ->has('filters')
        );
});

test('authenticated tutors can visit the dashboard', function () {
    $user = User::factory()->create(['role' => 'tutor']);
    Tutor::factory()->create(['user_id' => $user->id]);

    $this->actingAs($user);

    $this->get(route('tutor.dashboard'))->assertOk();
});
