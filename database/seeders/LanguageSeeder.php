<?php

namespace Database\Seeders;

use App\Models\Language;
use Illuminate\Database\Seeder;

class LanguageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $languages = [
            ['language' => 'English'],
            ['language' => 'French'],
            ['language' => 'Spanish'],
            ['language' => 'Arabic'],
            ['language' => 'Germany'],
        ];

        Language::query()->insert($languages);
    }
}
