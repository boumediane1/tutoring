<?php

use App\Http\Controllers\BookingController;
use App\Http\Controllers\ProfileDetailsController;
use App\Http\Controllers\SessionDocumentController;
use App\Http\Controllers\Student\DashboardController;
use App\Http\Middleware\EnsureUserHasRole;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    if (auth()->check()) {
        return match (auth()->user()->role) {
            'tutor' => redirect()->route('tutor.dashboard'),
            'student' => redirect()->route('student.dashboard'),
            default => redirect()->route('login'),
        };
    }

    return redirect()->route('login');
})->name('home');

Route::get('/dashboard', function () {
    return match (auth()->user()->role) {
        'tutor' => redirect()->route('tutor.dashboard'),
        'student' => redirect()->route('student.dashboard'),
        default => redirect()->route('home'),
    };
})->middleware(['auth'])->name('dashboard');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::middleware(EnsureUserHasRole::class.':tutor')->group(function () {
        Route::get('tutor/dashboard', [\App\Http\Controllers\Tutor\DashboardController::class, 'index'])->name('tutor.dashboard');

        Route::get('tutor/bookings', [\App\Http\Controllers\Tutor\BookingController::class, 'index'])->name('tutor.bookings.index');
        Route::patch('tutor/bookings/{booking}', [\App\Http\Controllers\Tutor\BookingController::class, 'update'])->name('tutor.bookings.update');
    });

    Route::middleware(EnsureUserHasRole::class.':student')->group(function () {
        Route::post('bookings', [BookingController::class, 'store'])->name('booking.store');
        Route::get('bookings/{tutor}', [BookingController::class, 'index'])->name('booking.index');
    });

    Route::get('profile/details', [ProfileDetailsController::class, 'edit'])->name('profile.details.edit');
    Route::put('profile/details', [ProfileDetailsController::class, 'update'])->name('profile.details.update');

    Route::get('bookings/show/{booking}', [BookingController::class, 'show'])->name('bookings.show');
    Route::get('sessions', [\App\Http\Controllers\SessionController::class, 'index'])->name('sessions.index');
    Route::get('bookings/{booking}/join', [\App\Http\Controllers\BookingJoinController::class, 'join'])->name('bookings.join');

    Route::post('bookings/{booking}/documents', [SessionDocumentController::class, 'store'])->name('bookings.documents.store');
    Route::get('documents/{document}/download', [SessionDocumentController::class, 'download'])->name('documents.download');
    Route::delete('documents/{document}', [SessionDocumentController::class, 'destroy'])->name('documents.destroy');

    Route::middleware(EnsureUserHasRole::class.':student')->group(function () {
        Route::get('student/dashboard', [DashboardController::class, 'index'])->name('student.dashboard');
        Route::get('student/tutors', [\App\Http\Controllers\Student\TutorController::class, 'index'])->name('student.tutors.index');
    });
});

require __DIR__.'/settings.php';
