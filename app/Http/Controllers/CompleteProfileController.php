<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileCompleteUpdateRequest;
use App\Models\Country;
use App\Models\Language;
use App\Models\Speciality;
use App\Models\Tag;
use App\Models\Tutor;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;
use Throwable;

class CompleteProfileController extends Controller
{
    public function edit(): Response
    {
        $tutor = Tutor::with(['country', 'languages', 'specialities', 'tags'])->find(Auth::id());
        $specialities = Speciality::query()->with('tags')->get();

        return Inertia::render('profile/complete', [
            'tutor' => $tutor,
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
        $languagesIds = Language::query()->whereIn('language', $request->validated('languages'))->pluck('id');
        $specialitiesIds = Speciality::query()->whereIn('title', $request->validated('specialities'))->pluck('id');
        $tagsIds = Tag::query()->whereIn('title', $request->validated('tags'))->pluck('id');


        if ($request->user()->isDirty('email')) {
            $request->user()->email_verified_at = null;
        }

        DB::transaction(function () use ($tagsIds, $specialitiesIds, $languagesIds, $request) {
            $request->user()->save();
            $request->user()->tutor->languages()->sync($languagesIds);
            $request->user()->tutor->specialities()->sync($specialitiesIds);
            $request->user()->tutor->tags()->sync($tagsIds);
        });
    }
}
