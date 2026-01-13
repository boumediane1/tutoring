<?php

use App\Models\Booking;
use App\Models\Student;
use App\Models\Tutor;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('status is set to pending right after booking', function () {
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
        'status' => 'pending',
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
        'status' => 'confirmed',
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

    $response->assertSessionHasErrors(['start' => 'The session must be booked in full hours.']);
});

it('disallows booking sessions that do not start at the beginning of an hour', function () {
    $user = User::factory()->create(['role' => 'student']);
    $this->actingAs($user);

    $tutor = Tutor::factory()->for(User::factory())->create();

    $response = $this->post('/bookings', [
        'tutor_id' => $tutor->id,
        'start' => '2026-01-02T08:15:00Z',
        'end' => '2026-01-02T09:15:00Z',
    ]);

    $response->assertSessionHasErrors(['start' => 'The session must start at the beginning of an hour (e.g., 10:00).']);
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
        'status' => 'confirmed',
    ]);

    $response = $this->get("/bookings/{$tutor->id}");

    $response->assertSuccessful();
    $this->assertEquals('student/booking-page', $response->inertiaPage()['component']);
    $this->assertCount(1, $response->inertiaPage()['props']['bookings']);
    $this->assertEquals('Confirmed', $response->inertiaPage()['props']['bookings'][0]['title']);
    $this->assertEquals($tutor->user->name, $response->inertiaPage()['props']['tutor']['name']);
});

it('hides other students booking details', function () {
    $tutor = Tutor::factory()->for(User::factory())->create();

    // Booking for student 1
    $student1 = Student::factory()->create();
    Booking::factory()->create([
        'tutor_id' => $tutor->id,
        'student_id' => $student1->id,
        'status' => 'confirmed',
    ]);

    // Booking for student 2
    $student2 = Student::factory()->create();
    Booking::factory()->create([
        'tutor_id' => $tutor->id,
        'student_id' => $student2->id,
        'status' => 'pending',
    ]);

    $this->actingAs($student1->user);
    $response = $this->get("/bookings/{$tutor->id}");

    $response->assertSuccessful();
    $bookings = $response->inertiaPage()['props']['bookings'];

    expect($bookings)->toHaveCount(2);

    $booking1 = collect($bookings)->first(fn ($booking) => $booking['title'] === 'Confirmed');
    $booking2 = collect($bookings)->first(fn ($booking) => $booking['title'] === 'Pending');

    expect($booking1)->not->toBeNull()
        ->and($booking2)->toBeNull()
        ->and(collect($bookings)->where('title', 'Unavailable'))->toHaveCount(1);
});
