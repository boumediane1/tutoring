<?php

namespace Database\Seeders;

use App\Models\Speciality;
use App\Models\Tag;
use Illuminate\Database\Seeder;

class TagSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $specialities = Speciality::query()->pluck('id', 'title');

        $tagsBySpeciality = [
            'Mathematics' => [
                'algebra',
                'geometry',
                'trigonometry',
                'calculus',
                'statistics',
                'probability',
                'linear algebra',
            ],

            'Physics' => [
                'mechanics',
                'electricity',
                'magnetism',
                'optics',
                'thermodynamics',
                'waves',
            ],

            'Chemistry' => [
                'organic chemistry',
                'inorganic chemistry',
                'physical chemistry',
                'analytical chemistry',
            ],

            'Biology' => [
                'cell biology',
                'genetics',
                'human biology',
                'ecology',
                'microbiology',
            ],

            'Computer Science' => [
                'algorithms',
                'data structures',
                'python',
                'java',
                'c++',
                'web development',
                'databases',
            ],

            'Information Technology' => [
                'networking',
                'system administration',
                'cybersecurity',
                'cloud computing',
                'operating systems',
            ],

            'Data Science & AI' => [
                'machine learning',
                'data analysis',
                'deep learning',
                'data visualization',
            ],

            'Engineering' => [
                'electrical engineering',
                'mechanical engineering',
                'civil engineering',
                'electronics',
                'CAD',
            ],

            'Languages' => [
                'grammar',
                'vocabulary',
                'conversation',
                'writing',
                'reading comprehension',
            ],

            'Business & Management' => [
                'management',
                'marketing',
                'finance',
                'accounting',
                'entrepreneurship',
            ],

            'Arts & Design' => [
                'graphic design',
                'illustration',
                'typography',
                'color theory',
            ],
        ];

        foreach ($tagsBySpeciality as $key => $value) {
            $tags = collect($value)
                ->map(fn ($tag) => ['title' => $tag, 'speciality_id' => $specialities[$key]])
                ->toArray();

            Tag::query()->insert($tags);
        }
    }
}
