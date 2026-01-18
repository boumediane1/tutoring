<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Services\BigBlueButtonService;
use Illuminate\Support\Facades\Auth;

class BookingJoinController extends Controller
{
    public function __construct(protected BigBlueButtonService $bbbService) {}

    public function join(Booking $booking)
    {
        $user = Auth::user();

        if (! $booking->canJoin()) {
            return back()->with('error', 'You cannot join this session at this time.');
        }

        $isTutor = $user->tutor && $user->tutor->id === $booking->tutor_id;
        $isStudent = $user->student && $user->student->id === $booking->student_id;

        if (! $isTutor && ! $isStudent) {
            abort(403);
        }

        try {
            $joinUrl = $this->bbbService->getJoinUrl(
                $booking,
                $user->name,
                $isTutor
            );

            return redirect()->away($joinUrl);
        } catch (\Exception $e) {
            return back()->with('error', 'Could not start the session: '.$e->getMessage());
        }
    }
}
