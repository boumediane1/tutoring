<?php

use App\Models\User;
use Database\Seeders\DatabaseSeeder;

test('registration screen can be rendered', function () {
    $response = $this->get(route('register'));

    $response->assertStatus(200);
});

test('new users can register', function () {
    $response = $this->post(route('register.store'), [
        'name' => 'Test User',
        'email' => 'test@example.com',
        'role' => 'tutor',
        'password' => 'password',
        'password_confirmation' => 'password',
    ]);

    $this->assertAuthenticated();
    $response->assertRedirect(route('tutor.dashboard', absolute: false));

    $user = User::where('email', 'test@example.com')->first();
    expect($user->image)->not->toBeNull()
        ->and(DatabaseSeeder::IMAGES)->toContain($user->image);
});
