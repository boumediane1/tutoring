<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

            User::firstOrCreate(
                ['email' => 'test@example.com'],
                [
                    'name' => 'Test User',
                    'password' => 'password',
                    'role' => 'tutor',
                    'email_verified_at' => now(),
                ]
            );

            $this->call([
                LanguageSeeder::class,
                SpecialitySeeder::class,
                TagSeeder::class,
                CountrySeeder::class
            ]);
    }
}
