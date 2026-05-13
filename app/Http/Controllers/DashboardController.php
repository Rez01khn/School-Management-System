<?php

namespace App\Http\Controllers;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use App\Models\Enrollment;
use App\Models\Teacher;
use App\Models\Course;
use App\Models\Student;
use App\Models\Tenant;
use App\Models\Exam;
use App\Models\Mark;
use App\Models\Attendance;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;

class DashboardController extends Controller
{
    public function index()
{
    $tenantId = Auth::user()->tenant_id;
    
    $stats = [
        'totalStudents' => Student::where('tenant_id', $tenantId)->count(),
        'totalTeachers' => Teacher::where('tenant_id', $tenantId)->count(),
        'totalCourses' => Course::where('tenant_id', $tenantId)->count(),
        'totalEnrollments' =>Enrollment::where('tenant_id', $tenantId)->count(),
        'totalExams' => Exam::where('tenant_id', $tenantId)->count(),
        'totalResults' =>Mark::where('tenant_id', $tenantId)->count(),
        'totalEvents' => 5,
    ];

    $attendanceData =Attendance::where('tenant_id', $tenantId)
        ->selectRaw('attendance_date, count(*) as total, sum(case when status = "present" then 1 else 0 end) as present')
        ->groupBy('attendance_date')->orderBy('attendance_date', 'desc')->limit(7)->get()->reverse()
        ->map(fn($a) => ['date' => date('d M', strtotime($a->attendance_date)), 'Present' => (int)$a->present])->values();

    return Inertia::render('dashboard', array_merge($stats, [
        'schoolName' =>Tenant::where('tenant_id', $tenantId)->value('school_name'),
        'attendanceChart' => $attendanceData,
    ]));
}
}
