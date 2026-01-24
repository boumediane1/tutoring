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
        'start' => now()->addDays(2)->startOfHour()->toIso8601String(),
        'end' => now()->addDays(2)->startOfHour()->addHours(2)->toIso8601String(),
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

    $start = now()->addDays(2)->startOfHour();
    $end = (clone $start)->addHours(2);

    Booking::query()->create([
        'tutor_id' => $tutor->id,
        'student_id' => $student->id,
        'start' => $start->toDateTimeString(),
        'end' => $end->toDateTimeString(),
        'status' => 'confirmed',
    ]);

    $this->post('/bookings', [
        'tutor_id' => $tutor->id,
        'start' => $start->toDateTimeString(),
        'end' => $end->toDateTimeString(),
    ])->assertSessionHasErrors();

    $this->assertDatabaseCount('bookings', 1);
});

it('disallows booking in the past', function () {
    $user = User::factory()->create(['role' => 'student']);
    $student = Student::factory()->for($user)->create();
    $this->actingAs($user);

    $tutor = Tutor::factory()->for(User::factory())->create();

    $response = $this->post('/bookings', [
        'tutor_id' => $tutor->id,
        'start' => now()->subDay()->startOfHour()->toIso8601String(),
        'end' => now()->subDay()->startOfHour()->addHour()->toIso8601String(),
    ]);

    $response->assertSessionHasErrors(['start']);
    $this->assertDatabaseCount('bookings', 0);
});

it('can fetch bookings for a tutor', function () {
    $user = User::factory()->create(['role' => 'student']);
    $this->actingAs($user);

    $tutor = Tutor::factory()->for(User::factory())->create();
    $student = Student::factory()->for($user)->create();

    Booking::factory()->create([
        'tutor_id' => $tutor->id,
        'student_id' => $student->id,
        'start' => now()->addDays(2)->startOfHour()->addHours(8)->toIso8601String(),
        'end' => now()->addDays(2)->startOfHour()->addHours(9)->toIso8601String(),
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

// it('can show session details to authorized users', function () {
//    $tutorUser = User::factory()->create(['role' => 'tutor']);
//    $tutor = Tutor::factory()->for($tutorUser)->create();
//
//    $studentUser = User::factory()->create(['role' => 'student']);
//    $student = Student::factory()->for($studentUser)->create();
//
//    $booking = Booking::factory()->create([
//        'tutor_id' => $tutor->id,
//        'student_id' => $student->id,
//        'status' => 'confirmed',
//    ]);
//
//    // Tutor can view
//    $this->actingAs($tutorUser);
//    $response = $this->get("/bookings/show/{$booking->id}");
//    $response->assertSuccessful();
//    $response->assertInertia(fn ($page) => $page->component('bookings/show'));
//
//    // Student can view
//    $this->actingAs($studentUser);
//    $response = $this->get("/bookings/show/{$booking->id}");
//    $response->assertSuccessful();
//
//    // Other user cannot view
//    $otherUser = User::factory()->create(['role' => 'student']);
//    Student::factory()->for($otherUser)->create();
//    $this->actingAs($otherUser);
//    $this->get("/bookings/show/{$booking->id}")->assertForbidden();
// });
