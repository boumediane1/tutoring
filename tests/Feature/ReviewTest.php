<?php

use App\Models\Booking;
use App\Models\Review;
use App\Models\Student;
use App\Models\Tutor;

it('allows a student to rate a tutor', function () {
    $student = Student::factory()->create();
    $booking = Booking::factory()->confirmed()->create([
        'student_id' => $student->id,
    ]);

    $response = $this->actingAs($student->user)
        ->post(route('reviews.store'), [
            'booking_id' => $booking->id,
            'rating' => 5,
        ]);

    $response->assertRedirect();
    $this->assertDatabaseHas('reviews', [
        'booking_id' => $booking->id,
        'rating' => 5,
    ]);
});

it('allows a student to update their rating', function () {
    $student = Student::factory()->create();
    $booking = Booking::factory()->confirmed()->create([
        'student_id' => $student->id,
    ]);
    Review::create(['booking_id' => $booking->id, 'rating' => 3]);

    $response = $this->actingAs($student->user)
        ->post(route('reviews.store'), [
            'booking_id' => $booking->id,
            'rating' => 4,
        ]);

    $response->assertRedirect();
    $this->assertDatabaseHas('reviews', [
        'booking_id' => $booking->id,
        'rating' => 4,
    ]);
    $this->assertEquals(1, Review::count());
});

it('does not allow a student to rate someone else\'s booking', function () {
    $student = Student::factory()->create();
    $otherStudent = Student::factory()->create();
    $booking = Booking::factory()->confirmed()->create([
        'student_id' => $otherStudent->id,
    ]);

    $response = $this->actingAs($student->user)
        ->post(route('reviews.store'), [
            'booking_id' => $booking->id,
            'rating' => 5,
        ]);

    $response->assertForbidden();
});

it('does not allow a tutor to rate', function () {
    $tutor = Tutor::factory()->create();
    $booking = Booking::factory()->confirmed()->create([
        'tutor_id' => $tutor->id,
    ]);

    $response = $this->actingAs($tutor->user)
        ->post(route('reviews.store'), [
            'booking_id' => $booking->id,
            'rating' => 5,
        ]);

    $response->assertForbidden();
});

it('validates the rating value', function () {
    $student = Student::factory()->create();
    $booking = Booking::factory()->confirmed()->create([
        'student_id' => $student->id,
    ]);

    $response = $this->actingAs($student->user)
        ->post(route('reviews.store'), [
            'booking_id' => $booking->id,
            'rating' => 6, // Invalid rating
        ]);

    $response->assertSessionHasErrors('rating');
});
