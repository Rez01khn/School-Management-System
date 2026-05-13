<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use App\Models\Student;
use App\Models\User;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Hash;


class StudentController extends Controller
{
    public function index()
    {
        $tenantId = Auth::user()->tenant_id;

        $students = Student::where('tenant_id', $tenantId)->with('user')->get();

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
            'email' => 'required|email|unique:users,email',
            'image' => 'nullable|image|mimes:jpg,png,jpeg|max:5120',
        ]);

        $tenantId = Auth::user()->tenant_id;

        DB::transaction(function () use ($request, $tenantId) {
            $user = User::create([
                'name' => $request->first_name . ' ' . $request->last_name,
                'email' => $request->email,
                'password' => Hash::make('student123'),
                'role' => 'student',
                'tenant_id' => $tenantId,
            ]);

            $imagePath = $request->hasFile('image') ? $request->file('image')->store('students', 'public') : null;

            Student::create([
                'tenant_id' => $tenantId,
                'user_id' => $user->id,
                'first_name' => $request->first_name,
                'last_name' => $request->last_name,
                'grade' => $request->grade,
                'image' => $imagePath,
            ]);
        });

        return Redirect::route('students.index');
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'first_name' => 'required|string|max:50',
            'last_name' => 'required|string|max:50',
            'grade' => 'required|integer',
            'email' => 'required|email|unique:users,email,' . Student::find($id)->user_id,
            'image' => 'nullable|image|mimes:jpg,png,jpeg|max:5120',
        ]);

        $student = Student::findOrFail($id);

        $student->user->update([
            'name' => $request->first_name . ' ' . $request->last_name,
            'email' => $request->email,
        ]);

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
        $student = Student::findOrFail($id);
        $user = User::find($student->user_id);
        $student->delete();
        if ($user)
            $user->delete();

        return Redirect::route('students.index');
    }

}
