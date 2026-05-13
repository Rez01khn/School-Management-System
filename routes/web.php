<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\TeacherController;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\EnrollmentController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\AttendanceController;
use App\Http\Controllers\ExamController;
use App\Http\Controllers\MarkController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\RoutineController;
use App\Http\Controllers\NoticeController;
use App\Http\Controllers\PaymentController;



Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');



Route::middleware(['auth'])->group(function () {

    
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('/report-card', [ReportController::class, 'index'])->name('reports.index');
    Route::get('/routines', [RoutineController::class, 'index'])->name('routines.index');
    Route::get('/notices', [NoticeController::class, 'index'])->name('notices.index');
    Route::get('/payments', [PaymentController::class, 'index'])->name('payments.index');


    
    Route::middleware(['role:admin'])->group(function () {
        
        
        Route::get('/teachers', [TeacherController::class, 'index'])->name('teachers.index');
        Route::post('/teachers', [TeacherController::class, 'store'])->name('teachers.store');
        Route::put('/teachers/{id}', [TeacherController::class, 'update'])->name('teachers.update');
        Route::delete('/teachers/{id}', [TeacherController::class, 'destroy'])->name('teachers.destroy');

        Route::get('/students', [StudentController::class, 'index'])->name('students.index');
        Route::post('/students', [StudentController::class, 'store'])->name('students.store');
        Route::put('/students/{id}', [StudentController::class, 'update'])->name('students.update');
        Route::delete('/students/{id}', [StudentController::class, 'destroy'])->name('students.destroy');

        
        Route::post('/courses', [CourseController::class, 'store'])->name('courses.store');
        Route::put('/courses/{id}', [CourseController::class, 'update'])->name('courses.update');
        Route::delete('/courses/{id}', [CourseController::class, 'destroy'])->name('courses.destroy');

       
        Route::get('/enrollments', [EnrollmentController::class, 'index'])->name('enrollments.index');
        Route::post('/enrollments', [EnrollmentController::class, 'store'])->name('enrollments.store');
        Route::put('/enrollments/{id}', [EnrollmentController::class, 'update'])->name('enrollments.update');
        Route::delete('/enrollments/{id}', [EnrollmentController::class, 'destroy'])->name('enrollments.destroy');

       
        Route::post('/routines', [RoutineController::class, 'store'])->name('routines.store');
        Route::put('/routines/{id}', [RoutineController::class, 'update'])->name('routines.update');
        Route::delete('/routines/{id}', [RoutineController::class, 'destroy'])->name('routines.destroy');

        
        Route::post('/notices', [NoticeController::class, 'store'])->name('notices.store');
        Route::put('/notices/{id}', [NoticeController::class, 'update'])->name('notices.update');
        Route::delete('/notices/{id}', [NoticeController::class, 'destroy'])->name('notices.destroy');

       
        Route::post('/payments', [PaymentController::class, 'store'])->name('payments.store');
        Route::put('/payments/{id}', [PaymentController::class, 'update'])->name('payments.update');
        Route::delete('/payments/{id}', [PaymentController::class, 'destroy'])->name('payments.destroy');
    });


    
    Route::middleware(['role:admin,teacher'])->group(function () {
        
        Route::get('/courses', [CourseController::class, 'index'])->name('courses.index');
        Route::get('/attendance', [AttendanceController::class, 'index'])->name('attendance.index');
        Route::post('/attendance', [AttendanceController::class, 'store'])->name('attendance.store');

        Route::get('/exams', [ExamController::class, 'index'])->name('exams.index');
        Route::post('/exams', [ExamController::class, 'store'])->name('exams.store');
        Route::put('/exams/{id}', [ExamController::class, 'update'])->name('exams.update');
        Route::delete('/exams/{id}', [ExamController::class, 'destroy'])->name('exams.destroy');

        Route::get('/marks', [MarkController::class, 'index'])->name('marks.index');
        Route::post('/marks', [MarkController::class, 'store'])->name('marks.store');
        Route::put('/marks/{id}', [MarkController::class, 'update'])->name('marks.update');
        Route::delete('/marks/{id}', [MarkController::class, 'destroy'])->name('marks.destroy');
    });

});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';