<?php

namespace App\Http\Controllers;

use App\Models\Invoice;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BillingController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();
        $query = Invoice::query()->with(['booking', 'student.user', 'tutor.user']);

        if ($user->role === 'tutor') {
            $query->where('tutor_id', $user->tutor->id);
        } else {
            $query->where('student_id', $user->student->id);
        }

        $invoices = $query->latest()->paginate(10);

        return Inertia::render('billing/index', [
            'invoices' => $invoices->through(function ($invoice) {
                return [
                    'id' => $invoice->id,
                    'amount' => $invoice->amount,
                    'status' => $invoice->status,
                    'date' => $invoice->created_at->toIso8601String(),
                    'booking' => [
                        'id' => $invoice->booking->id,
                        'start' => $invoice->booking->start->toIso8601String(),
                        'end' => $invoice->booking->end->toIso8601String(),
                    ],
                    'student' => [
                        'name' => $invoice->student->user->name,
                    ],
                    'tutor' => [
                        'name' => $invoice->tutor->user->name,
                    ],
                ];
            }),
        ]);
    }
}
