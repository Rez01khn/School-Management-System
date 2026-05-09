<?php

namespace App\Http\Controllers;
use App\Models\Exam;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;

class ExamController extends Controller
{
    public function index()
    {
        $tenantId = Auth::user()->tenant_id;
        $exams = Exam::where('tenant_id', $tenantId)->get();

        return Inertia::render('exams/index', [
            'exams' => $exams
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'exam_name' => 'required|string|max:100',
            'year' => 'required|integer',
        ]);

        $validated['tenant_id'] = Auth::user()->tenant_id;
        Exam::create($validated);

        return Redirect::route('exams.index');
    }

    public function update(Request $request, $id)
{
    $validated = $request->validate([
        'exam_name' => 'required|string|max:100',
        'year' => 'required|integer',
    ]);

    $exam = Exam::where('tenant_id', Auth::user()->tenant_id)->findOrFail($id);
    $exam->update($validated);

    return Redirect::route('exams.index');
}

public function destroy($id)
{
    $exam = Exam::where('tenant_id', Auth::user()->tenant_id)->findOrFail($id);
    $exam->delete();

    return Redirect::route('exams.index');
}
}
