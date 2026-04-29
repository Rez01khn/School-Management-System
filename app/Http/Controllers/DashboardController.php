<?php

namespace App\Http\Controllers;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use App\Models\Enrollment;
use App\Models\Teacher;
use App\Models\Course;
use App\Models\Student;
use App\Models\Tenant;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index()
    {
        $tenantId =Auth::user()->tenant_id;
        $schoolName = Tenant::where('tenant_id',$tenantId)->value('school_name');
        $totalStudents = Student::where('tenant_id', $tenantId)->count();
        $totalCourses =  Course::where('tenant_id', $tenantId)->count();
        $totalTeachers = Teacher::where('tenant_id', $tenantId)->count();
        $totalSubjects = Teacher::where('tenant_id', $tenantId)->distinct('subject')->count('subject');
        $totalEnrollment = Enrollment::where('tenant_id', $tenantId)->count();


        return Inertia::render('dashboard', [
            'schoolName' => $schoolName,
            'totalStudents' =>$totalStudents,
            'totalCourses' => $totalCourses,
            'totalTeacher' => $totalTeachers,
            'totalSubject' =>$totalStudents,
            'totalEnrollments' => $totalEnrollment,
        ]);
    }
}
