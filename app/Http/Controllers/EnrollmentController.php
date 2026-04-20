<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use App\Models\Enrollment;
use Illuminate\Support\Facades\Redirect;

class EnrollmentController extends Controller
{
    public function index()
    {
        $tenantId = Auth::user()->tenant_id;
        $enrollments = Enrollment::where('tenant_id', $tenantId)->get();
        $students =\App\Models\Student::where('tenant_id', $tenantId)->get(['student_id', 'first_name', 'last_name']);
        $courses = \App\Models\Course::where('tenant_id',$tenantId)->get(['course_id', 'course_name']);
        return Inertia::render('enrollment/index',[
            'tenant_id' => $tenantId,
            'enrollments' => $enrollments,
            'students' => $students,
            'courses' => $courses,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'student_id' => 'required|integer',
            'course_id' => 'required|integer',
            'enrolment_date' => 'required|date'
        ]);
    }
}
