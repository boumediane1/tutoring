<?php

namespace Tests\Feature\Tutor;

use App\Models\Booking;
use App\Models\Tutor;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

it('tutor can see their dashboard with stats and bookings', function () {
    $tutor = Tutor::factory()->for(User::factory()->create(['role' => 'tutor']))->create();

    // Create some bookings
    Booking::factory()->confirmed()->create([
        'tutor_id' => $tutor->id,
        'start' => now()->addDay(),
        'end' => now()->addDay()->addHour(),
    ]);

    Booking::factory()->pending()->create([
        'tutor_id' => $tutor->id,
    ]);

    $this->actingAs($tutor->user)
        ->get(route('tutor.dashboard'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('tutor/dashboard')
            ->has('stats')
            ->where('stats.total_sessions', 1)
            ->where('stats.pending_requests', 1)
            ->where('stats.upcoming_sessions', 1)
            ->has('upcomingBookings', 1)
            ->missing('pendingBookings')
        );
});
