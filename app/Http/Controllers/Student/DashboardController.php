<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Speciality;
use App\Models\Tutor;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $tutors = Tutor::query()
            ->with(['user', 'country', 'specialities', 'tags'])
            ->when($request->input('speciality'), function (Builder $query, string $speciality) {
                $query->whereRelation('specialities', 'title', $speciality);
            })
            ->when($request->input('tag'), function (Builder $query, string $tag) {
                $query->whereRelation('tags', 'title', $tag);
            })
            ->when($request->input('tutor'), function (Builder $query, string $user) {
                $query->whereRelation('user', 'name', 'like', "%{$user}%");
            })
            ->get();

        $specialities = Speciality::with('tags')->get();

        return Inertia::render('student/dashboard', [
            'tutors' => $tutors,
            'specialities' => $specialities,
        ]);
    }
}
