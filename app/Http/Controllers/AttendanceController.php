<?php

namespace App\Http\Controllers;
use App\Models\Attendance;
use App\Models\Course;
use App\Models\Enrollment;
use App\Models\Teacher;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class AttendanceController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();
        $tenantId = $user->tenant_id;

        
        if ($user->role === 'teacher') {
            $teacher = Teacher::where('user_id', $user->id)->first();
            $courses = Course::where('tenant_id', $tenantId)
                             ->where('teacher_id', $teacher->teacher_id)
                             ->get();
        } else {
            $courses = Course::where('tenant_id', $tenantId)->get();
        }

        $selectedCourseId = $request->course_id;
        $attendanceDate = $request->attendance_date ?? now()->toDateString();
        $students = [];

        if ($selectedCourseId) {
            $studentIds = Enrollment::where('course_id', $selectedCourseId)
                                    ->where('tenant_id', $tenantId)
                                    ->where('enrollment_date', '<=', $attendanceDate)
                                    ->pluck('student_id');
            
            $students = \App\Models\Student::whereIn('student_id', $studentIds)->get();
        }

        return Inertia::render('attendance/index', [
            'courses' => $courses,
            'students' => $students,
            'selectedCourseId' => (int) $selectedCourseId,
            'selectedDate' => $attendanceDate
        ]);
    }

    public function store(Request $request)
    {
        $tenantId = Auth::user()->tenant_id;
        $date = $request->attendance_date;
        $courseId = $request->course_id;
        $attendances = $request->attendances;

        foreach ($attendances as $studentId => $status) {
            Attendance::updateOrCreate(
                [
                    'tenant_id' => $tenantId,
                    'student_id' => $studentId,
                    'course_id' => $courseId,
                    'attendance_date' => $date
                ],
                ['status' => $status]
            );
        }
        return back()->with('success', 'Attendance recorded successfully!');
    }
}
