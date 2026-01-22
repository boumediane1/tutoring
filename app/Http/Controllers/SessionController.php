<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SessionController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();

        $query = Booking::query()
            ->with(['tutor.user', 'student.user', 'review'])
            ->withCount('documents')
            ->where('status', 'confirmed');

        if ($user->role === 'tutor') {
            $query->where('tutor_id', $user->tutor->id);
        } else {
            $query->where('student_id', $user->student->id);
        }

        $sessions = $query->orderBy('start', 'desc')->paginate(10);

        return Inertia::render('sessions/index', [
            'sessions' => $sessions->through(function ($session) {
                return [
                    'id' => $session->id,
                    'name' => $session->name,
                    'start' => $session->start->toIso8601String(),
                    'end' => $session->end->toIso8601String(),
                    'duration' => $session->start->diffInMinutes($session->end),
                    'tutor' => [
                        'name' => $session->tutor->user->name,
                        'image' => $session->tutor->user->image,
                    ],
                    'student' => [
                        'name' => $session->student->user->name,
                        'image' => $session->student->user->image,
                    ],
                    'documents_count' => $session->documents_count,
                    'rating' => $session->review?->rating,
                ];
            }),
        ]);
    }
}
