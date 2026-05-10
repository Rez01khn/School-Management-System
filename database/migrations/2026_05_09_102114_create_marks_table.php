<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('marks', function (Blueprint $table) {
            $table->increments('mark_id');
            $table->integer('tenant_id')->nullable();
            $table->integer('exam_id');
            $table->integer('student_id');
            $table->integer('course_id');
            $table->integer('marks_obtained');
            $table->integer('total_marks')->default(100); 
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('marks');
    }
};
