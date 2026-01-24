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

        $pendingBookingsQuery = $tutor->bookings()
            ->with('student.user')
            ->where('status', 'pending')
            ->orderBy('created_at', 'desc');

        $pendingBookingsCount = $pendingBookingsQuery->count();
        $pendingBookings = $pendingBookingsQuery->limit(5)->get();

        $upcomingBookingsQuery = $tutor->bookings()
            ->with('student.user')
            ->where('status', 'confirmed')
            ->where('end', '>=', now())
            ->orderBy('start');

        $upcomingBookingsCount = $upcomingBookingsQuery->count();
        $upcomingBookings = $upcomingBookingsQuery->limit(5)->get();

        $stats = [
            'total_sessions' => $tutor->bookings()->where('status', 'confirmed')->count(),
            'pending_requests' => $pendingBookingsCount,
            'upcoming_sessions' => $upcomingBookingsCount,
            'average_rating' => round($tutor->reviews()->avg('rating') ?? 0, 1),
            'total_reviews' => $tutor->reviews()->count(),
        ];

        return Inertia::render('tutor/dashboard', [
            'pendingBookings' => $pendingBookings,
            'upcomingBookings' => $upcomingBookings,
            'stats' => $stats,
            'counts' => [
                'pending' => $pendingBookingsCount,
                'upcoming' => $upcomingBookingsCount,
            ],
        ]);
    }
}
