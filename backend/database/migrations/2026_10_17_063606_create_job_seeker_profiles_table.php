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
        Schema::create('job_seeker_profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('headline')->nullable();
            $table->foreignId('district_id')->nullable()->constrained('districts')->nullOnDelete();
            $table->string('current_location')->nullable();
            $table->string('experience_level')->nullable();
            $table->decimal('expected_salary', 10, 2)->nullable();
            $table->string('resume_path')->nullable();
            $table->string('resume_filename')->nullable();
            $table->string('linkedin_url')->nullable();
            $table->string('github_url')->nullable();
            $table->string('portfolio_url')->nullable();
            $table->text('professional_summary')->nullable();
            $table->json('skills')->nullable();
            $table->json('education')->nullable();
            $table->json('work_history')->nullable();
            $table->json('preferred_locations')->nullable();
            $table->integer('profile_completion')->default(80);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('job_seeker_profiles');
    }
};
