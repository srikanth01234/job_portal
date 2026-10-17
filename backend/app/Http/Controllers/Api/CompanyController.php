<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Company;
use App\Models\JobListing;
use App\Models\Application;
use App\Models\Interview;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class CompanyController extends Controller
{
    /**
     * Get Company Profile
     */
    public function getProfile(Request $request)
    {
        $user = $request->user();
        $company = Company::with('district')->where('user_id', $user->id)->firstOrFail();

        return response()->json([
            'success' => true,
            'company' => $company,
        ]);
    }

    /**
     * Update Company Profile
     */
    public function updateProfile(Request $request)
    {
        $user = $request->user();
        $company = Company::where('user_id', $user->id)->firstOrFail();

        $company->update($request->only([
            'company_name', 'industry', 'district_id', 'location',
            'website', 'phone', 'email', 'about', 'company_size'
        ]));

        return response()->json([
            'success' => true,
            'message' => 'Company profile updated successfully',
            'company' => $company->fresh()->load('district'),
        ]);
    }

    /**
     * Upload Company Logo
     */
    public function uploadLogo(Request $request)
    {
        $request->validate([
            'logo' => 'required|image|mimes:jpeg,png,jpg,svg,webp|max:2048',
        ]);

        $user = $request->user();
        $company = Company::where('user_id', $user->id)->firstOrFail();

        if ($company->logo && Storage::disk('public')->exists($company->logo)) {
            Storage::disk('public')->delete($company->logo);
        }

        $path = $request->file('logo')->store('company_logos', 'public');
        $company->update(['logo' => $path]);

        return response()->json([
            'success' => true,
            'message' => 'Logo uploaded successfully',
            'logo_url' => asset('storage/' . $path),
        ]);
    }

    /**
     * Get Company Job Listings
     */
    public function getMyJobs(Request $request)
    {
        $user = $request->user();
        $company = $user->company;

        if (!$company) {
            return response()->json(['success' => false, 'message' => 'Company profile not found.'], 404);
        }

        $jobs = JobListing::with(['category', 'district'])
            ->withCount('applications')
            ->where('company_id', $company->id)
            ->latest()
            ->get();

        return response()->json([
            'success' => true,
            'data' => $jobs,
        ]);
    }

    /**
     * Schedule an Interview with a Candidate
     */
    public function scheduleInterview(Request $request)
    {
        $request->validate([
            'application_id' => 'required|exists:applications,id',
            'interview_date' => 'required|date|after:now',
            'round_name' => 'required|string',
            'interview_type' => 'required|in:online,in_person',
            'meeting_link' => 'nullable|string',
            'location_address' => 'nullable|string',
            'notes' => 'nullable|string',
        ]);

        $user = $request->user();
        $company = $user->company;

        $application = Application::where('id', $request->application_id)
            ->where('company_id', $company->id)
            ->firstOrFail();

        $interview = Interview::create([
            'application_id' => $application->id,
            'company_id' => $company->id,
            'user_id' => $application->user_id,
            'interview_date' => $request->interview_date,
            'round_name' => $request->round_name,
            'interview_type' => $request->interview_type,
            'meeting_link' => $request->meeting_link,
            'location_address' => $request->location_address,
            'notes' => $request->notes,
            'status' => 'scheduled',
        ]);

        // Move application status to interview
        $application->update(['status' => 'interview']);

        return response()->json([
            'success' => true,
            'message' => 'Interview scheduled successfully!',
            'data' => $interview->load(['user', 'application.jobListing']),
        ], 201);
    }

    /**
     * Get Scheduled Interviews
     */
    public function getInterviews(Request $request)
    {
        $user = $request->user();

        if ($user->role === 'company' && $user->company) {
            $interviews = Interview::with(['user.seekerProfile', 'application.jobListing'])
                ->where('company_id', $user->company->id)
                ->orderBy('interview_date')
                ->get();
        } elseif ($user->role === 'seeker') {
            $interviews = Interview::with(['company', 'application.jobListing'])
                ->where('user_id', $user->id)
                ->orderBy('interview_date')
                ->get();
        } else {
            return response()->json(['success' => false, 'message' => 'Unauthorized role.'], 403);
        }

        return response()->json([
            'success' => true,
            'data' => $interviews,
        ]);
    }
}
