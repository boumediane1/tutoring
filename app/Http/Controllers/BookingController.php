<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreBookingRequest;
use App\Models\Booking;
use App\Models\Tutor;
use Inertia\Inertia;
use Inertia\Response;

class BookingController extends Controller
{
    public function index(Tutor $tutor): Response
    {
        $tutor->load('user');

        $bookings = Booking::query()
            ->where('tutor_id', $tutor->id)
            ->get(['id', 'start', 'end', 'confirmed']);

        return Inertia::render('student/booking-page', [
            'tutor' => [
                'id' => $tutor->id,
                'name' => $tutor->user->name,
            ],
            'bookings' => $bookings->map(fn ($booking) => [
                'id' => (string) $booking->id,
                'title' => $booking->confirmed ? 'Booked' : 'Pending',
                'start' => $booking->start,
                'end' => $booking->end,
                'color' => $booking->confirmed ? '#10b981' : '#f59e0b',
            ]),
        ]);
    }

    public function store(StoreBookingRequest $request)
    {
        $student = $request->user()->student()->firstOrCreate([]);

        $booking = new Booking([
            'student_id' => $student->id,
            'tutor_id' => $request->input('tutor_id'),
            'start' => $request->input('start'),
            'end' => $request->input('end'),
        ]);

        $booking->save();

        return back();
    }
}
