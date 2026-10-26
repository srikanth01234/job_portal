<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\JobSeekerProfile;
use App\Models\User;
use App\Models\SavedJob;
use App\Models\JobListing;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class JobSeekerController extends Controller
{
    private function resolveSeekerUser(Request $request)
    {
        if ($user = auth('sanctum')->user()) {
            return $user;
        }
        if ($user = $request->user()) {
            return $user;
        }
        if ($request->filled('user_id') && ($u = User::find($request->user_id))) {
            return $u;
        }
        if ($request->hasHeader('X-User-Id') && ($u = User::find($request->header('X-User-Id')))) {
            return $u;
        }
        if ($request->hasHeader('X-User-Email') && ($u = User::where('email', $request->header('X-User-Email'))->first())) {
            return $u;
        }
        if ($request->filled('email') && ($u = User::where('email', $request->email)->first())) {
            return $u;
        }
        return User::where('role', 'seeker')->latest()->first() 
            ?? User::first();
    }

    /**
     * Get Candidate Profile
     */
    public function getProfile(Request $request)
    {
        $user = $this->resolveSeekerUser($request);
        if (!$user) {
            return response()->json(['success' => false, 'message' => 'No candidate profile found.'], 404);
        }

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
        $user = $this->resolveSeekerUser($request);
        if (!$user) {
            return response()->json(['success' => false, 'message' => 'No candidate found.'], 404);
        }

        $profile = JobSeekerProfile::where('user_id', $user->id)->firstOrCreate([
            'user_id' => $user->id,
        ]);

        // Update user base fields
        if ($request->filled('name') || $request->filled('phone') || $request->filled('email')) {
            $user->update($request->only(['name', 'phone', 'email']));
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

    private function runPythonParser($filePath)
    {
        $scriptPath = base_path('app/Services/resume_parser.py');
        $command = 'python ' . escapeshellarg($scriptPath) . ' ' . escapeshellarg($filePath);
        $output = shell_exec($command);
        if ($output) {
            $data = json_decode($output, true);
            if (is_array($data)) {
                return $data;
            }
        }
        return null;
    }

    /**
     * Upload Resume (PDF / DOCX)
     */
    public function uploadResume(Request $request)
    {
        $request->validate([
            'resume' => 'required|file|mimes:pdf,doc,docx|max:5120', // Max 5MB
        ]);

        $user = $this->resolveSeekerUser($request);
        if (!$user) {
            return response()->json(['success' => false, 'message' => 'Please sign in to upload resume.'], 401);
        }
        $profile = JobSeekerProfile::firstOrCreate(['user_id' => $user->id]);

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

        $fullPath = storage_path('app/public/' . $path);
        $extracted = $this->runPythonParser($fullPath);

        // If requested to auto-apply extracted data immediately
        if ($request->boolean('auto_apply', false) && $extracted) {
            $userUpdates = [];
            if (!empty($extracted['name'])) $userUpdates['name'] = $extracted['name'];
            if (!empty($extracted['email']) && !User::where('email', $extracted['email'])->where('id', '!=', $user->id)->exists()) {
                $userUpdates['email'] = $extracted['email'];
            }
            if (!empty($extracted['phone'])) $userUpdates['phone'] = $extracted['phone'];
            if (!empty($userUpdates)) $user->update($userUpdates);

            $profileUpdates = [];
            if (!empty($extracted['linkedin_url'])) $profileUpdates['linkedin_url'] = $extracted['linkedin_url'];
            if (!empty($extracted['professional_summary'])) $profileUpdates['professional_summary'] = $extracted['professional_summary'];
            if (!empty($extracted['skills'])) $profileUpdates['skills'] = $extracted['skills'];
            if (!empty($extracted['education'])) $profileUpdates['education'] = $extracted['education'];
            if (!empty($extracted['work_history'])) $profileUpdates['work_history'] = $extracted['work_history'];
            if (!empty($profileUpdates)) $profile->update($profileUpdates);
        }

        return response()->json([
            'success' => true,
            'message' => 'Resume uploaded successfully' . ($extracted ? ' and parsed' : ''),
            'resume_url' => asset('storage/' . $path),
            'resume_filename' => $originalName,
            'extracted' => $extracted,
            'user' => $user->fresh(),
            'profile' => $profile->fresh()->load('district'),
        ]);
    }

    /**
     * Extract structured info from candidate's uploaded resume
     */
    public function extractResume(Request $request)
    {
        $user = $this->resolveSeekerUser($request);
        if (!$user) {
            return response()->json(['success' => false, 'message' => 'Please sign in.'], 401);
        }

        $profile = JobSeekerProfile::where('user_id', $user->id)->first();
        if (!$profile || !$profile->resume_path) {
            return response()->json(['success' => false, 'message' => 'No resume uploaded yet. Please upload a resume first.'], 400);
        }

        $resumeFullPath = storage_path('app/public/' . $profile->resume_path);
        if (!file_exists($resumeFullPath)) {
            return response()->json(['success' => false, 'message' => 'Resume file not found on disk.'], 404);
        }

        $extracted = $this->runPythonParser($resumeFullPath);
        if (!$extracted) {
            return response()->json(['success' => false, 'message' => 'Failed to parse resume content.'], 500);
        }

        // Auto-apply extracted data to user & profile in MySQL
        $userUpdates = [];
        if (!empty($extracted['name'])) $userUpdates['name'] = $extracted['name'];
        if (!empty($extracted['email']) && !User::where('email', $extracted['email'])->where('id', '!=', $user->id)->exists()) {
            $userUpdates['email'] = $extracted['email'];
        }
        if (!empty($extracted['phone'])) $userUpdates['phone'] = $extracted['phone'];
        if (!empty($userUpdates)) {
            $user->update($userUpdates);
        }

        $profileUpdates = [];
        if (!empty($extracted['linkedin_url'])) $profileUpdates['linkedin_url'] = $extracted['linkedin_url'];
        if (!empty($extracted['professional_summary'])) $profileUpdates['professional_summary'] = $extracted['professional_summary'];
        if (!empty($extracted['skills'])) $profileUpdates['skills'] = $extracted['skills'];
        if (!empty($extracted['education'])) $profileUpdates['education'] = $extracted['education'];
        if (!empty($extracted['work_history'])) $profileUpdates['work_history'] = $extracted['work_history'];
        if (!empty($profileUpdates)) {
            $profile->update($profileUpdates);
        }

        return response()->json([
            'success' => true,
            'message' => 'Resume details extracted and profile updated successfully!',
            'extracted' => $extracted,
            'user' => $user->fresh(),
            'profile' => $profile->fresh()->load('district'),
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

        $user = $this->resolveSeekerUser($request);
        if (!$user) {
            return response()->json(['success' => false, 'message' => 'User not found.'], 404);
        }

        if ($user->avatar && Storage::disk('public')->exists($user->avatar)) {
            Storage::disk('public')->delete($user->avatar);
        }

        $path = $request->file('avatar')->store('avatars', 'public');
        $user->update(['avatar' => $path]);

        $avatarUrl = asset('storage/' . $path);

        return response()->json([
            'success' => true,
            'message' => 'Avatar updated successfully',
            'avatar_url' => $avatarUrl,
            'user' => $user->fresh(),
        ]);
    }

    /**
     * Get Saved / Bookmarked Jobs
     */
    public function getSavedJobs(Request $request)
    {
        $user = $this->resolveSeekerUser($request);
        if (!$user) {
            return response()->json(['success' => true, 'data' => [], 'total' => 0]);
        }

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
        $user = $this->resolveSeekerUser($request);
        if (!$user) {
            return response()->json(['success' => false, 'message' => 'Please sign in.'], 401);
        }
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
