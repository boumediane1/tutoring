<?php

namespace Database\Seeders;

use App\Models\Country;
use Illuminate\Database\Seeder;

class CountrySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $countries = [
            ['name' => 'India'],
            ['name' => 'China'],
            ['name' => 'United States'],
            ['name' => 'Indonesia'],
            ['name' => 'Pakistan'],
            ['name' => 'Nigeria'],
            ['name' => 'Brazil'],
            ['name' => 'Bangladesh'],
            ['name' => 'Russia'],
            ['name' => 'Mexico'],
        ];

        Country::query()->insert($countries);
    }
}
