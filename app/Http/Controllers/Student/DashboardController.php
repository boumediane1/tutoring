<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Tutor;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $student = $request->user()->student;

        $upcomingBookingsQuery = $student->bookings()
            ->with('tutor.user')
            ->where('status', 'confirmed')
            ->where('end', '>=', now())
            ->orderBy('start');

        $upcomingBookingsCount = $upcomingBookingsQuery->count();
        $upcomingBookings = $upcomingBookingsQuery->limit(5)->get();

        $recentTutors = Tutor::query()
            ->whereIn('id', $student->bookings()->select('tutor_id')->distinct())
            ->with(['user', 'country', 'specialities'])
            ->limit(3)
            ->get();

        $stats = [
            'upcoming_lessons' => $upcomingBookingsCount,
            'pending_requests' => $student->bookings()->where('status', 'pending')->count(),
            'total_completed' => $student->bookings()
                ->where('status', 'confirmed')
                ->where('end', '<', now())
                ->count(),
        ];

        return Inertia::render('student/dashboard', [
            'upcomingBookings' => $upcomingBookings,
            'recentTutors' => $recentTutors,
            'stats' => $stats,
            'counts' => [
                'upcoming' => $upcomingBookingsCount,
            ],
        ]);
    }
}
