<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileCompleteUpdateRequest;
use App\Models\Country;
use App\Models\Language;
use App\Models\Speciality;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;
use Throwable;

class CompleteProfileController extends Controller
{
    public function edit(User $user): Response
    {
        $specialities = Speciality::query()->with('tags')->get();

        return Inertia::render('profile/complete', [
            'countries' => Country::all(),
            'languages' => Language::all(),
            'specialities' => $specialities,
        ]);
    }

    /**
     * @throws Throwable
     */
    public function update(ProfileCompleteUpdateRequest $request, User $user)
    {
        $request->user()->fill($request->validated());

        if ($request->user()->isDirty('email')) {
            $request->user()->email_verified_at = null;
        }

        DB::transaction(function () use ($request) {
            $request->user()->save();
            $request->user()->tutor->languages()->attach($request->validated('languages'));
            $request->user()->tutor->specialities()->attach($request->validated('specialities'));
            $request->user()->tutor->tags()->attach($request->validated('tags'));
        });
    }
}
