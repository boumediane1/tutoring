<?php

namespace Database\Seeders;

use App\Models\Tutor;
use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::query()->firstOrCreate(
            ['email' => 'test@example.com'],
            [
                'name' => 'Test User',
                'password' => 'password',
                'role' => 'tutor',
                'email_verified_at' => now(),
            ]
        );

        Tutor::query()->create(['user_id' => 1]);

        $this->call([
            LanguageSeeder::class,
            SpecialitySeeder::class,
            TagSeeder::class,
            CountrySeeder::class
        ]);
    }
}
