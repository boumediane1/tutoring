<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileCompleteUpdateRequest;
use App\Models\Country;
use App\Models\Language;
use App\Models\Speciality;
use App\Models\Tag;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;
use Throwable;

class CompleteProfileController extends Controller
{
    public function edit(): Response
    {
        $specialities = Speciality::query()->with('tags')->get();

        return Inertia::render('profile/complete', [
            'tutor' => Auth::user()->tutor->load('country', 'languages', 'specialities', 'tags'),
            'countries' => Country::all(),
            'languages' => Language::all(),
            'specialities' => $specialities,
        ]);
    }

    /**
     * @throws Throwable
     */
    public function update(ProfileCompleteUpdateRequest $request, User $user): RedirectResponse
    {
        $languagesIds = Language::query()->whereIn('language', $request->validated('languages'))->pluck('id');
        $specialitiesIds = Speciality::query()->whereIn('title', $request->validated('specialities'))->pluck('id');
        $tagsIds = Tag::query()->whereIn('title', $request->validated('tags'))->pluck('id');

        if ($request->user()->isDirty('email')) {
            $request->user()->email_verified_at = null;
        }

        DB::transaction(function () use ($tagsIds, $specialitiesIds, $languagesIds, $request) {
            $user = $request->user();
            $user->fill($request->safe()->only(['name', 'email']));
            $user->save();

            $tutor = $user->tutor;
            $tutor->fill([
                'bio' => $request->validated('bio'),
                'country_id' => Country::where('name', $request->validated('country'))->firstOrFail()->id,
            ]);
            $tutor->save();

            $tutor->languages()->sync($languagesIds);
            $tutor->specialities()->sync($specialitiesIds);
            $tutor->tags()->sync($tagsIds);
        });

        return back();
    }
}
