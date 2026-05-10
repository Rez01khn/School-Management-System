<?php

namespace App\Http\Controllers;
use App\Models\Mark;
use App\Models\Exam;
use App\Models\Student;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;

class ReportController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();
        $tenantId = $user->tenant_id;
        
        $students = Student::where('tenant_id', $tenantId)->get();
        $exams = Exam::where('tenant_id', $tenantId)->get();

        $selectedStudentId = $request->student_id;
        $selectedExamId = $request->exam_id;

        if ($user->role === 'student') {
            $student = Student::where('user_id', $user->id)->first();
            $selectedStudentId = $student->student_id;
        }

        $reportData = [];
        if ($selectedStudentId && $selectedExamId) {
            $reportData = Mark::where([
                'tenant_id' => $tenantId,
                'student_id' => $selectedStudentId,
                'exam_id' => $selectedExamId
            ])->with('course')->get();
        }

        return Inertia::render('reports/index', [
            'students' => $students,
            'exams' => $exams,
            'reportData' => $reportData,
            'selectedStudent' => Student::find($selectedStudentId),
            'selectedExam' => Exam::find($selectedExamId)
        ]);
    }
}
