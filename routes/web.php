<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\TeacherController;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
    
    Route::get('/teachers', [TeacherController::class, 'index'])->name('teachers.index');
    Route::post('/teachers', [TeacherController::class, 'store'])->name('teacher.store');
    Route::put('/teachers/{id}',[TeacherController::class, 'update'])->name('teachers.update');

    Route::delete('/teachers/{id}',[TeacherController::class, 'destroy'])->name('teachers.destroy');




});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
