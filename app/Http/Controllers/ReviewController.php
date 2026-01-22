<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreReviewRequest;
use App\Models\Booking;
use App\Models\Review;
use Illuminate\Http\RedirectResponse;

class ReviewController extends Controller
{
    public function store(StoreReviewRequest $request): RedirectResponse
    {
        $booking = Booking::findOrFail($request->booking_id);

        if ($booking->student_id !== $request->user()->student->id) {
            abort(403);
        }

        Review::updateOrCreate(
            ['booking_id' => $booking->id],
            ['rating' => $request->rating]
        );

        return back();
    }
}
