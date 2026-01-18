<?php

use App\Models\Booking;
use App\Models\Student;
use App\Models\Tutor;
use App\Models\User;
use App\Services\BigBlueButtonService;

use function Pest\Laravel\actingAs;
use function Pest\Laravel\mock;

it('cannot join a booking that is not confirmed', function () {
    $user = User::factory()->create(['role' => 'student']);
    $student = Student::factory()->create(['user_id' => $user->id]);
    $booking = Booking::factory()->pending()->create(['student_id' => $student->id]);

    actingAs($user)
        ->get(route('bookings.join', $booking))
        ->assertRedirect()
        ->assertSessionHas('error', 'You cannot join this session at this time.');
});

it('cannot join a booking before start time', function () {
    $user = User::factory()->create(['role' => 'student']);
    $student = Student::factory()->create(['user_id' => $user->id]);
    $booking = Booking::factory()->confirmed()->create([
        'student_id' => $student->id,
        'start' => now()->addHour(),
        'end' => now()->addHours(2),
    ]);

    actingAs($user)
        ->get(route('bookings.join', $booking))
        ->assertRedirect()
        ->assertSessionHas('error', 'You cannot join this session at this time.');
});

it('cannot join a booking after end time', function () {
    $user = User::factory()->create(['role' => 'student']);
    $student = Student::factory()->create(['user_id' => $user->id]);
    $booking = Booking::factory()->confirmed()->create([
        'student_id' => $student->id,
        'start' => now()->subHours(2),
        'end' => now()->subHour(),
    ]);

    actingAs($user)
        ->get(route('bookings.join', $booking))
        ->assertRedirect()
        ->assertSessionHas('error', 'You cannot join this session at this time.');
});

it('can join a booking during the session time', function () {
    $user = User::factory()->create(['name' => 'John Doe', 'role' => 'student']);
    $student = Student::factory()->create(['user_id' => $user->id]);
    $booking = Booking::factory()->confirmed()->create([
        'student_id' => $student->id,
        'start' => now()->subMinutes(10),
        'end' => now()->addMinutes(50),
    ]);

    mock(BigBlueButtonService::class)
        ->shouldReceive('getJoinUrl')
        ->once()
        ->withArgs(function ($b, $name, $isMod) use ($booking) {
            return $b->id === $booking->id && $name === 'John Doe' && $isMod === false;
        })
        ->andReturn('https://bbb.example.com/join/123');

    actingAs($user)
        ->get(route('bookings.join', $booking))
        ->assertRedirect('https://bbb.example.com/join/123');
});

it('tutor can join as moderator during the session time', function () {
    $user = User::factory()->create(['name' => 'Tutor Jane', 'role' => 'tutor']);
    $tutor = Tutor::factory()->create(['user_id' => $user->id]);
    $booking = Booking::factory()->confirmed()->create([
        'tutor_id' => $tutor->id,
        'start' => now()->subMinutes(10),
        'end' => now()->addMinutes(50),
    ]);

    mock(BigBlueButtonService::class)
        ->shouldReceive('getJoinUrl')
        ->once()
        ->withArgs(function ($b, $name, $isMod) use ($booking) {
            return $b->id === $booking->id && $name === 'Tutor Jane' && $isMod === true;
        })
        ->andReturn('https://bbb.example.com/join/moderator/123');

    actingAs($user)
        ->get(route('bookings.join', $booking))
        ->assertRedirect('https://bbb.example.com/join/moderator/123');
});
