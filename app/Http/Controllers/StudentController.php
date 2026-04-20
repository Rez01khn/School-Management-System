<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use App\Models\Student;
use Illuminate\Support\Facades\Redirect;

class StudentController extends Controller
{
    public function index()
    {
        $tenantId = Auth::user()->tenant_id;

        $students = Student::where('tenant_id', $tenantId)->get();

        return Inertia::render('student/index', [
            'tenant_id' => $tenantId,
            'students' => $students,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'first_name' => 'required|string|max:50',
            'last_name' => 'required|string|max:50',
            'grade' => 'required|integer',
            'image' => 'nullable|image|mimes:jpg,png,jpeg|max:5120',
        ]);

        if ($request->hasFile('image')) {
        $validated['image'] = $request->file('image')->store('students', 'public');
    }
        $validated['tenant_id'] = Auth::user()->tenant_id;
        Student::create($validated);
        return Redirect::route('students.index');
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'first_name' => 'required|string|max:50',
            'last_name' => 'required|string|max:50',
            'grade' => 'required|integer',
            'image' => 'nullable|image|mimes:jpg,png,jpeg|max:5120',
        ]);
        $student = Student::where('tenant_id', Auth::user()->tenant_id)->findOrFail($id);
        if ($request->hasFile('image')) {
        if ($student->image) {
            \Storage::disk('public')->delete($student->image);
        }
        $validated['image'] = $request->file('image')->store('students', 'public');
    }
        $student->update($validated);
        return Redirect::route('students.index');
    }

    public function destroy($id)
    {
        $student = Student::where('tenant_id', Auth::user()->tenant_id)->findOrFail($id);
        $student->delete();

        return Redirect::route('students.index');
    }

}
