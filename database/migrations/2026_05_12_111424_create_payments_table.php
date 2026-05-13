<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('payments', function (Blueprint $table) {
            $table->id('payment_id');
        $table->integer('tenant_id');
        $table->integer('student_id');
        
        $table->string('title');
        $table->decimal('amount', 10, 2); 
        $table->date('due_date');
        $table->enum('status', ['paid', 'unpaid', 'partial'])->default('unpaid');
        $table->decimal('paid_amount', 10, 2)->default(0); 
        
        $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
