<?php

use App\Models\Booking;
use App\Models\Student;
use App\Models\Tutor;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('confirmed is set to false right after booking', function () {
    $user = User::factory()->create(['role' => 'student']);
    $this->actingAs($user);

    $tutor = Tutor::factory()->for(User::factory())->create();
    $student = Student::factory()->for($user)->create();

    $this->post('/bookings', [
        'tutor_id' => $tutor->id,
        'start' => '2026-01-02T08:00:00Z',
        'end' => '2026-01-02T10:00:00Z',
    ]);

    $this->assertDatabaseHas('bookings', [
        'confirmed' => false,
        'tutor_id' => $tutor->id,
        'student_id' => $student->id,
    ]);
});

it('student cannot book unavailable time slot', function () {
    $user = User::factory()->create(['role' => 'student']);
    $this->actingAs($user);

    $tutor = Tutor::factory()->for(User::factory())->create();
    $student = Student::factory()->for($user)->create();

    Booking::query()->create([
        'tutor_id' => $tutor->id,
        'student_id' => $student->id,
        'start' => '2026-01-01T00:00:00Z',
        'end' => '2026-01-01T02:00:00Z',
        'confirmed' => true,
    ]);

    $this->post('/bookings', [
        'tutor_id' => $tutor->id,
        'start' => '2026-01-01T00:00:00Z',
        'end' => '2026-01-01T02:00:00Z',
    ]);

    $this->post('/bookings', [
        'tutor_id' => $tutor->id,
        'start' => '2026-01-01T00:30:00Z',
        'end' => '2026-01-01T01:30:00Z',
    ]);

    $this->assertDatabaseCount('bookings', 1);
});

it('disallows booking half an hour sessions', function () {
    $user = User::factory()->create(['role' => 'student']);
    $this->actingAs($user);

    $tutor = Tutor::factory()->for(User::factory())->create();

    $response = $this->post('/bookings', [
        'tutor_id' => $tutor->id,
        'start' => '2026-01-02T08:00:00Z',
        'end' => '2026-01-02T08:30:00Z',
    ]);

    $response->assertSessionHasErrors(['start']);
});

it('creates student record on the fly when booking if missing', function () {
    $user = User::factory()->create(['role' => 'student']);
    $this->actingAs($user);

    $tutor = Tutor::factory()->for(User::factory())->create();

    $response = $this->post('/bookings', [
        'tutor_id' => $tutor->id,
        'start' => '2026-01-02T08:00:00Z',
        'end' => '2026-01-02T10:00:00Z',
    ]);

    $response->assertRedirect();
    $this->assertDatabaseHas('students', ['user_id' => $user->id]);
});

it('can fetch bookings for a tutor', function () {
    $user = User::factory()->create(['role' => 'student']);
    $this->actingAs($user);

    $tutor = Tutor::factory()->for(User::factory())->create();
    $student = Student::factory()->for($user)->create();

    Booking::factory()->create([
        'tutor_id' => $tutor->id,
        'student_id' => $student->id,
        'start' => '2026-01-01T08:00:00Z',
        'end' => '2026-01-01T09:00:00Z',
        'confirmed' => true,
    ]);

    $response = $this->get("/bookings/{$tutor->id}");

    $response->assertSuccessful();
    $this->assertEquals('student/booking-page', $response->inertiaPage()['component']);
    $this->assertCount(1, $response->inertiaPage()['props']['bookings']);
    $this->assertEquals('Booked', $response->inertiaPage()['props']['bookings'][0]['title']);
    $this->assertEquals($tutor->user->name, $response->inertiaPage()['props']['tutor']['name']);
});
