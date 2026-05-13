<?php

namespace App\Http\Controllers;

use App\Models\Routine;
use App\Models\Course;
use App\Models\Teacher;
use App\Models\Enrollment;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class RoutineController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $tenantId = $user->tenant_id;

        $query = Routine::where('tenant_id', $tenantId)->with(['course', 'teacher']);

        if ($user->role === 'teacher') {
            $teacher = Teacher::where('user_id', $user->id)->first();
            $query->where('teacher_id', $teacher->teacher_id);
        } elseif ($user->role === 'student') {
            $student = \App\Models\Student::where('user_id', $user->id)->first();
            $courseIds = Enrollment::where('student_id', $student->student_id)->pluck('course_id');
            $query->whereIn('course_id', $courseIds);
        }

        $routines = $query->orderBy('start_time')->get();

        return Inertia::render('routines/index', [
            'routines' => $routines,
            'courses' => Course::where('tenant_id', $tenantId)->get(),
            'teachers' => Teacher::where('tenant_id', $tenantId)->get(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'course_id' => 'required|integer',
            'teacher_id' => 'required|integer',
            'day' => 'required|string',
            'start_time' => 'required',
            'end_time' => 'required',
            'room_number' => 'nullable|string',
        ]);

        $validated['tenant_id'] = Auth::user()->tenant_id;
        Routine::create($validated);

        return back()->with('success', 'Routine added successfully!');
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'course_id' => 'required|integer',
            'teacher_id' => 'required|integer',
            'day' => 'required|string',
            'start_time' => 'required',
            'end_time' => 'required',
            'room_number' => 'nullable|string',
        ]);

        $routine = Routine::where('tenant_id', Auth::user()->tenant_id)->findOrFail($id);
        $routine->update($validated);

        return back()->with('success', 'Routine updated successfully!');
    }

    public function destroy($id)
    {
        $routine = Routine::where('tenant_id', Auth::user()->tenant_id)->findOrFail($id);
        $routine->delete();

        return back()->with('success', 'Routine deleted successfully!');
    }
}
