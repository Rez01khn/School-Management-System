<?php

namespace App\Http\Controllers;

use App\Models\Notice;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;


class NoticeController extends Controller
{
     public function index()
    {
        $user = Auth::user();
        $tenantId = $user->tenant_id;

        $query = Notice::where('tenant_id', $tenantId);
        if ($user->role === 'teacher') {
            $query->whereIn('target_audience', ['everyone', 'teacher']);
        } elseif ($user->role === 'student') {
            $query->whereIn('target_audience', ['everyone', 'student']);
        }

        $notices = $query->latest()->get();

        return Inertia::render('notices/index', [
            'notices' => $notices
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'message' => 'required|string',
            'target_audience' => 'required|in:everyone,teacher,student',
            'expiry_date' => 'nullable|date'
        ]);

        $validated['tenant_id'] = Auth::user()->tenant_id;
        Notice::create($validated);

        return back()->with('success', 'Notice posted successfully!');
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'message' => 'required|string',
            'target_audience' => 'required|in:everyone,teacher,student',
            'expiry_date' => 'nullable|date'
        ]);

        $notice = Notice::where('tenant_id', Auth::user()->tenant_id)->findOrFail($id);
        $notice->update($validated);

        return back()->with('success', 'Notice updated successfully!');
    }

    public function destroy($id)
    {
        $notice = Notice::where('tenant_id', Auth::user()->tenant_id)->findOrFail($id);
        $notice->delete();

        return back()->with('success', 'Notice deleted successfully!');
    }
}
