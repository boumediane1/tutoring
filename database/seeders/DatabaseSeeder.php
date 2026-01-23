<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public const IMAGES = [
        'https://images.unsplash.com/photo-1615109398623-88346a601842?q=80&w=1287&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=1287&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1590086782957-93c06ef21604?q=80&w=1287&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1602233158242-3ba0ac4d2167?q=80&w=1336&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1288&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1287&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1287&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1287&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1364&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1287&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=1287&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=1287&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?q=80&w=1272&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1592621385612-4d7129426394?q=80&w=1287&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1288&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1613181013804-1dcba09e6a9d?q=80&w=1389&auto=format&fit=crop',
    ];

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            LanguageSeeder::class,
            SpecialitySeeder::class,
            TagSeeder::class,
            CountrySeeder::class,
            TutorSeeder::class,
            StudentSeeder::class,
            // BookingSeeder::class,
        ]);
    }
}
