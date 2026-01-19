<?php

use App\Models\Invoice;
use App\Models\Student;
use App\Models\Tutor;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('creates an invoice when a booking is stored', function () {
    $user = User::factory()->create(['role' => 'student']);
    $student = Student::factory()->for($user)->create();
    $tutorUser = User::factory()->create(['role' => 'tutor']);
    $tutor = Tutor::factory()->for($tutorUser)->create(['hourly_rate' => 50]);

    $this->actingAs($user);

    $start = now()->addDays(2)->startOfHour();
    $end = (clone $start)->addHours(2);

    $this->post('/bookings', [
        'tutor_id' => $tutor->id,
        'start' => $start->toIso8601String(),
        'end' => $end->toIso8601String(),
    ]);

    $this->assertDatabaseHas('invoices', [
        'student_id' => $student->id,
        'tutor_id' => $tutor->id,
        'amount' => 100.00,
        'status' => 'paid',
    ]);
});

it('allows student to see their invoices', function () {
    $user = User::factory()->create(['role' => 'student']);
    $student = Student::factory()->for($user)->create();
    $this->actingAs($user);

    Invoice::factory()->count(3)->create(['student_id' => $student->id]);
    Invoice::factory()->create(); // other student's invoice

    $response = $this->get('/billings');

    $response->assertStatus(200);
    $response->assertInertia(fn ($page) => $page
        ->component('billing/index')
        ->has('invoices.data', 3)
    );
});

it('allows tutor to see their invoices', function () {
    $user = User::factory()->create(['role' => 'tutor']);
    $tutor = Tutor::factory()->for($user)->create();
    $this->actingAs($user);

    Invoice::factory()->count(2)->create(['tutor_id' => $tutor->id]);
    Invoice::factory()->create(); // other tutor's invoice

    $response = $this->get('/billings');

    $response->assertStatus(200);
    $response->assertInertia(fn ($page) => $page
        ->component('billing/index')
        ->has('invoices.data', 2)
    );
});
