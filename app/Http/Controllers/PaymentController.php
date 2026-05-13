<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Payment;
use App\Models\Student;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class PaymentController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $tenantId = $user->tenant_id;

        $query = Payment::where('tenant_id', $tenantId)->with('student');


        if ($user->role === 'student') {
            $student = Student::where('user_id', $user->id)->first();
            $query->where('student_id', $student->student_id);
        }

        return Inertia::render('payments/index', [
            'payments' => $query->latest()->get(),
            'students' => Student::where('tenant_id', $tenantId)->get(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'student_id' => 'required|integer',
            'title' => 'required|string',
            'amount' => 'required|numeric',
            'due_date' => 'required|date',
        ]);

        $validated['tenant_id'] = Auth::user()->tenant_id;
        $validated['status'] = 'unpaid';
        Payment::create($validated);

        return back()->with('success', 'Invoice created successfully!');
    }


    public function update(Request $request, $id)
    {
        $payment = Payment::findOrFail($id);
        $payment->update([
            'paid_amount' => $request->paid_amount,
            'status' => $request->paid_amount >= $payment->amount ? 'paid' : 'partial'
        ]);

        return back()->with('success', 'Payment status updated!');
    }

    public function destroy($id)
    {
        $payment = Payment::where('tenant_id', Auth::user()->tenant_id)->findOrFail($id);
        $payment->delete();
        return back()->with('success', 'Invoice deleted successfully!');
    }
}
