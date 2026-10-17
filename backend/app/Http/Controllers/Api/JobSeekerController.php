<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\JobSeekerProfile;
use App\Models\SavedJob;
use App\Models\JobListing;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class JobSeekerController extends Controller
{
    /**
     * Get Candidate Profile
     */
    public function getProfile(Request $request)
    {
        $user = $request->user();
        $profile = JobSeekerProfile::with('district')->where('user_id', $user->id)->firstOrCreate([
            'user_id' => $user->id,
        ]);

        return response()->json([
            'success' => true,
            'user' => $user,
            'profile' => $profile,
        ]);
    }

    /**
     * Update Candidate Profile
     */
    public function updateProfile(Request $request)
    {
        $user = $request->user();
        $profile = JobSeekerProfile::where('user_id', $user->id)->firstOrFail();

        // Update user base fields
        if ($request->filled('name') || $request->filled('phone')) {
            $user->update($request->only(['name', 'phone']));
        }

        // Update seeker profile fields
        $profile->update($request->only([
            'headline', 'district_id', 'current_location', 'experience_level',
            'expected_salary', 'linkedin_url', 'github_url', 'portfolio_url',
            'professional_summary', 'skills', 'education', 'work_history',
            'preferred_locations', 'profile_completion'
        ]));

        return response()->json([
            'success' => true,
            'message' => 'Profile updated successfully',
            'user' => $user->fresh(),
            'profile' => $profile->fresh()->load('district'),
        ]);
    }

    /**
     * Upload Resume (PDF / DOCX)
     */
    public function uploadResume(Request $request)
    {
        $request->validate([
            'resume' => 'required|file|mimes:pdf,doc,docx|max:5120', // Max 5MB
        ]);

        $user = $request->user();
        $profile = JobSeekerProfile::where('user_id', $user->id)->firstOrFail();

        // Delete old resume file if exists
        if ($profile->resume_path && Storage::disk('public')->exists($profile->resume_path)) {
            Storage::disk('public')->delete($profile->resume_path);
        }

        $file = $request->file('resume');
        $originalName = $file->getClientOriginalName();
        $path = $file->store('resumes', 'public');

        $profile->update([
            'resume_path' => $path,
            'resume_filename' => $originalName,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Resume uploaded successfully',
            'resume_url' => asset('storage/' . $path),
            'resume_filename' => $originalName,
        ]);
    }

    /**
     * Upload Avatar Photo
     */
    public function uploadAvatar(Request $request)
    {
        $request->validate([
            'avatar' => 'required|image|mimes:jpeg,png,jpg,webp|max:2048', // Max 2MB
        ]);

        $user = $request->user();

        if ($user->avatar && Storage::disk('public')->exists($user->avatar)) {
            Storage::disk('public')->delete($user->avatar);
        }

        $path = $request->file('avatar')->store('avatars', 'public');
        $user->update(['avatar' => $path]);

        return response()->json([
            'success' => true,
            'message' => 'Avatar updated successfully',
            'avatar_url' => asset('storage/' . $path),
        ]);
    }

    /**
     * Get Saved / Bookmarked Jobs
     */
    public function getSavedJobs(Request $request)
    {
        $user = $request->user();

        $savedJobs = SavedJob::with(['jobListing.company', 'jobListing.category', 'jobListing.district'])
            ->where('user_id', $user->id)
            ->latest()
            ->get();

        return response()->json([
            'success' => true,
            'data' => $savedJobs,
            'total' => $savedJobs->count(),
        ]);
    }

    /**
     * Toggle Save / Bookmark Job
     */
    public function toggleSaveJob(Request $request, $jobId)
    {
        $user = $request->user();
        $job = JobListing::findOrFail($jobId);

        $existing = SavedJob::where('user_id', $user->id)
            ->where('job_listing_id', $job->id)
            ->first();

        if ($existing) {
            $existing->delete();
            return response()->json([
                'success' => true,
                'is_saved' => false,
                'message' => 'Job removed from saved jobs.',
            ]);
        }

        SavedJob::create([
            'user_id' => $user->id,
            'job_listing_id' => $job->id,
        ]);

        return response()->json([
            'success' => true,
            'is_saved' => true,
            'message' => 'Job saved to your bookmarks.',
        ]);
    }
}
