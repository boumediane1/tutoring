<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileCompleteUpdateRequest;
use App\Models\Country;
use App\Models\Language;
use App\Models\Speciality;
use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;

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

    public function update(ProfileCompleteUpdateRequest $request, User $user)
    {
        $request->user()->fill($request->validated());

        if ($request->user()->isDirty('email')) {
            $request->user()->email_verified_at = null;
        }

        $request->user()->save();
    }
}
