<?php

namespace App\Actions\Fortify;

use App\Models\Student;
use App\Models\Tutor;
use App\Models\User;
use Database\Seeders\DatabaseSeeder;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Laravel\Fortify\Contracts\CreatesNewUsers;

class CreateNewUser implements CreatesNewUsers
{
    use PasswordValidationRules;

    /**
     * Validate and create a newly registered user.
     *
     * @param  array<string, string>  $input
     */
    public function create(array $input): User
    {
        $validated = Validator::make($input, [
            'name' => ['required', 'string', 'max:255'],
            'email' => [
                'required',
                'string',
                'email',
                'max:255',
                Rule::unique(User::class),
            ],
            'password' => $this->passwordRules(),
            'role' => 'required',
        ])->validate();

        $user = User::create([
            'name' => $input['name'],
            'email' => $input['email'],
            'password' => $input['password'],
            'role' => $input['role'],
            'image' => $input['role'] === 'tutor' ? DatabaseSeeder::IMAGES[array_rand(DatabaseSeeder::IMAGES)] : null,
        ]);

        if ($validated['role'] === 'tutor') {
            Tutor::query()->create([
                'user_id' => $user->id,
            ]);
        }

        if ($validated['role'] === 'student') {
            Student::query()->create([
                'user_id' => $user->id,
            ]);
        }

        return $user;
    }
}
