<?php

namespace Tests\Feature;

use App\Models\Booking;
use App\Models\Tutor;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

it('tutor can see their bookings', function () {
    $booking = Booking::factory()->pending()->create([
        'start' => '2026-01-13T10:00:00Z',
        'end' => '2026-01-13T11:00:00Z',
    ]);

    $booking->student->user->update(['name' => 'John Doe']);

    $this->actingAs($booking->tutor->user)
        ->get(route('tutor.bookings.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('tutor/bookings')
            ->has('bookings', 1)
            ->where('bookings.0.title', 'John Doe')
            ->where('bookings.0.status', 'pending')
            ->where('bookings.0.student.name', 'John Doe')
        );
});

it('tutor can confirm a booking', function () {
    $booking = Booking::factory()->pending()->create();

    $this->actingAs($booking->tutor->user)
        ->patch(route('tutor.bookings.update', $booking), [
            'status' => 'confirmed',
        ])
        ->assertRedirect();

    expect($booking->refresh()->status)->toBe('confirmed');
});

it('tutor can reject a booking', function () {
    $booking = Booking::factory()->pending()->create();

    $this->actingAs($booking->tutor->user)
        ->patch(route('tutor.bookings.update', $booking), [
            'status' => 'rejected',
        ])
        ->assertRedirect();

    expect($booking->refresh()->status)->toBe('rejected');
});

it('tutor cannot update a booking that does not belong to them', function () {
    $tutor = Tutor::factory()->for(User::factory()->create(['role' => 'tutor']))->create();

    $booking = Booking::factory()->pending()->create();

    $this->actingAs($tutor->user)
        ->patch(route('tutor.bookings.update', $booking), [
            'status' => 'confirmed',
        ])
        ->assertForbidden();

    expect($booking->refresh()->status)->toBe('pending');
});
