<?php

use App\Models\Speciality;
use App\Models\Student;
use App\Models\Tag;
use App\Models\Tutor;
use App\Models\User;

beforeEach(function () {
    $this->studentUser = User::factory()->create(['role' => 'student']);
    $this->student = Student::factory()->create(['user_id' => $this->studentUser->id]);
    $this->actingAs($this->studentUser);
});

test('tutors can be filtered by speciality', function () {
    $math = Speciality::create(['title' => 'Math']);
    $science = Speciality::create(['title' => 'Science']);

    $tutor1 = Tutor::factory()->create();
    $tutor1->specialities()->attach($math);

    $tutor2 = Tutor::factory()->create();
    $tutor2->specialities()->attach($science);

    $response = $this->get(route('student.tutors.index', ['speciality' => 'Math']));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->has('tutors', 1)
        ->where('tutors.0.id', $tutor1->id)
    );
});

test('tutors can be filtered by tag', function () {
    $math = Speciality::create(['title' => 'Math']);
    $algebra = Tag::create(['title' => 'Algebra', 'speciality_id' => $math->id]);
    $geometry = Tag::create(['title' => 'Geometry', 'speciality_id' => $math->id]);

    $tutor1 = Tutor::factory()->create();
    $tutor1->tags()->attach($algebra);

    $tutor2 = Tutor::factory()->create();
    $tutor2->tags()->attach($geometry);

    $response = $this->get(route('student.tutors.index', ['tag' => 'Algebra']));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->has('tutors', 1)
        ->where('tutors.0.id', $tutor1->id)
    );
});

test('tutors can be filtered by name', function () {
    $user1 = User::factory()->create(['name' => 'John Doe']);
    $tutor1 = Tutor::factory()->create(['user_id' => $user1->id]);

    $user2 = User::factory()->create(['name' => 'Jane Smith']);
    $tutor2 = Tutor::factory()->create(['user_id' => $user2->id]);

    $response = $this->get(route('student.tutors.index', ['tutor' => 'John']));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->has('tutors', 1)
        ->where('tutors.0.id', $tutor1->id)
    );
});
