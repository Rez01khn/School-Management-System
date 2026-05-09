<?php

namespace App\Http\Controllers;
use App\Models\Mark;
use App\Models\Exam;
use App\Models\Course;
use App\Models\Enrollment;
use App\Models\Student;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class MarkController extends Controller
{
    public function index(Request $request)
    {
        $tenantId = Auth::user()->tenant_id;
        $exams = Exam::where('tenant_id', $tenantId)->get();
        $courses = Course::where('tenant_id', $tenantId)->get();

        $selectedExamId = $request->exam_id;
        $selectedCourseId = $request->course_id;
        $students = [];

        if ($selectedExamId && $selectedCourseId) {
            $studentIds = Enrollment::where('course_id', $selectedCourseId)
                ->where('tenant_id', $tenantId)
                ->pluck('student_id');

            $students = Student::whereIn('student_id', $studentIds)
                ->get()
                ->map(function ($student) use ($selectedExamId, $selectedCourseId, $tenantId) {
                    $existingMark = Mark::where([
                        'tenant_id' => $tenantId,
                        'exam_id' => $selectedExamId,
                        'course_id' => $selectedCourseId,
                        'student_id' => $student->student_id
                    ])->first();

                    $student->marks_obtained = $existingMark ? $existingMark->marks_obtained : '';
                    return $student;
                });
        }

        $allMarks = Mark::where('tenant_id', $tenantId)
            ->with(['student', 'course', 'exam']) 
            ->latest()
            ->get();

        return Inertia::render('marks/index', [
            'exams' => $exams,
            'courses' => $courses,
            'students' => $students,
            'allMarks' => $allMarks,
            'selectedExamId' => (int) $selectedExamId,
            'selectedCourseId' => (int) $selectedCourseId
        ]);
    }

    
    public function store(Request $request)
    {
        $request->validate([
            'exam_id' => 'required|integer',
            'course_id' => 'required|integer',
            'marks' => 'required|array',
        ]);

        $tenantId = Auth::user()->tenant_id;
        $examId = $request->exam_id;
        $courseId = $request->course_id;
        $marksData = $request->marks;

        foreach ($marksData as $studentId => $markValue) {
            
            if ($markValue !== null && $markValue !== '') {
                Mark::updateOrCreate(
                    [
                        'tenant_id' => $tenantId,
                        'exam_id' => $examId,
                        'course_id' => $courseId,
                        'student_id' => $studentId
                    ],
                    [
                        'marks_obtained' => $markValue, 
                        'total_marks' => 100 
                    ]
                );
            }
        }

        return redirect()->route('marks.index')->with('success', 'Marks updated successfully!');
    }

    
    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'marks_obtained' => 'required|integer|min:0|max:100',
        ]);

        $mark = Mark::where('tenant_id', Auth::user()->tenant_id)->findOrFail($id);
        $mark->update($validated);

        return back()->with('success', 'Mark updated successfully!');
    }

    
    public function destroy($id)
    {
        $mark = Mark::where('tenant_id', Auth::user()->tenant_id)->findOrFail($id);
        $mark->delete();

        return back()->with('success', 'Mark deleted successfully!');
    }
}
