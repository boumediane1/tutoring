<?php

namespace App\Http\Controllers\Tutor;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BookingController extends Controller
{
    public function index(Request $request): Response
    {
        $bookings = $request->user()->tutor->bookings()
            ->with('student.user')
            ->get();

        return Inertia::render('tutor/bookings', [
            'bookings' => $bookings->map(function ($booking) {
                return [
                    'id' => (string) $booking->id,
                    'title' => $booking->student->user->name,
                    'start' => $booking->start->toIso8601String(),
                    'end' => $booking->end->toIso8601String(),
                    'status' => $booking->status,
                    'student' => [
                        'name' => $booking->student->user->name,
                        'email' => $booking->student->user->email,
                    ],
                    'color' => match ($booking->status) {
                        'confirmed' => '#10b981',
                        'pending' => '#f59e0b',
                        'rejected' => '#ef4444',
                        default => '#6b7280',
                    },
                ];
            }),
        ]);
    }

    public function update(Request $request, Booking $booking)
    {
        // Ensure the booking belongs to the tutor
        if ($booking->tutor_id !== $request->user()->tutor->id) {
            abort(403);
        }

        $validated = $request->validate([
            'status' => 'required|in:confirmed,rejected',
        ]);

        $booking->update([
            'status' => $validated['status'],
        ]);

        return back();
    }
}
