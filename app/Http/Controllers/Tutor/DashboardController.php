<?php

namespace App\Http\Controllers\Tutor;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(Request $request): Response
    {
        $tutor = $request->user()->tutor;

        $upcomingBookings = $tutor->bookings()
            ->with('student.user')
            ->where('status', 'confirmed')
            ->where('start', '>=', now())
            ->orderBy('start')
            ->limit(5)
            ->get();

        $stats = [
            'total_sessions' => $tutor->bookings()->where('status', 'confirmed')->count(),
            'pending_requests' => $tutor->bookings()->where('status', 'pending')->count(),
            'upcoming_sessions' => $upcomingBookings->count(),
        ];

        return Inertia::render('tutor/dashboard', [
            'upcomingBookings' => $upcomingBookings,
            'stats' => $stats,
        ]);
    }
}
