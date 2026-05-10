<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use App\Models\Teacher;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class TeacherController extends Controller
{
    public function index()
    {
        $tenantId = Auth::user()->tenant_id;

        $teachers = Teacher::where('tenant_id', $tenantId)->with('user')->get();

        return Inertia::render('teacher/index', [
            'tenant_id' => $tenantId,
            'teachers' => $teachers,
        ]);
    }

    public function store(Request $request)
    {
    $validated = $request->validate([
        'first_name' => 'required|string|max:50',
        'last_name'  => 'required|string|max:50',
        'subject'    => 'required|string|max:50',
        'email'      => 'required|email|unique:users,email', 
    ]);

    $tenantId = Auth::user()->tenant_id;
    
    DB::transaction(function () use ($request, $tenantId) {
        
        $user = User::create([
            'name' => $request->first_name . ' ' . $request->last_name,
            'email' => $request->email,
            'password' => Hash::make('teacher123'), 
            'role' => 'teacher',
            'tenant_id' => $tenantId,
        ]);
        Teacher::create([
            'tenant_id' => $tenantId,
            'user_id'   => $user->id,
            'first_name'=> $request->first_name,
            'last_name' => $request->last_name,
            'subject'   => $request->subject,
        ]);
    });

    return Redirect::route('teachers.index');
}

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'first_name' => 'required|string|max:50',
            'last_name' => 'required|string|max:50',
            'subject' => 'required|string|max:50',
        ]);

        $teacher = Teacher::where('tenant_id', Auth::user()->tenant_id)->findOrFail($id);
        $teacher->update($validated);
        return Redirect::route('teachers.index');
    }

    public function destroy($id)
    {
        $teacher = Teacher::where('tenant_id', Auth::user()->tenant_id)->findOrFail($id);


        $teacher->delete();

        return Redirect::route('teachers.index');
    }
}
