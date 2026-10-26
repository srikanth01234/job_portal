<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Company;
use App\Models\User;
use App\Models\JobListing;
use App\Models\Application;
use App\Models\Interview;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class CompanyController extends Controller
{
    private function resolveCompanyUser(Request $request)
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
        if ($request->filled('company_id') && ($comp = Company::find($request->company_id)) && $comp->user) {
            return $comp->user;
        }
        if ($request->filled('email') && ($u = User::where('email', $request->email)->first())) {
            return $u;
        }
        return User::where('role', 'company')->first() 
            ?? User::first();
    }

    /**
     * Get Company Profile
     */
    public function getProfile(Request $request)
    {
        $user = $this->resolveCompanyUser($request);
        $company = $user ? Company::with('district')->where('user_id', $user->id)->first() : null;
        if (!$company) {
            $company = Company::with('district')->first();
        }

        return response()->json([
            'success' => true,
            'user' => $user,
            'company' => $company,
        ]);
    }

    /**
     * Update Company Profile
     */
    public function updateProfile(Request $request)
    {
        $user = $this->resolveCompanyUser($request);
        $company = $user ? Company::where('user_id', $user->id)->first() : null;
        if (!$company) {
            $company = Company::first();
        }

        if (!$company) {
            return response()->json(['success' => false, 'message' => 'No company found.'], 404);
        }

        // Update user record if provided
        if ($user) {
            $userUpdates = [];
            if ($request->filled('name')) $userUpdates['name'] = $request->input('name');
            if ($request->filled('phone')) $userUpdates['phone'] = $request->input('phone');
            if ($request->filled('email')) $userUpdates['email'] = $request->input('email');
            if (!empty($userUpdates)) {
                $user->update($userUpdates);
            }
        }

        $company->update($request->only([
            'company_name', 'industry', 'district_id', 'location',
            'website', 'phone', 'email', 'about', 'company_size'
        ]));

        return response()->json([
            'success' => true,
            'message' => 'Company profile updated successfully',
            'company' => $company->fresh()->load('district'),
            'user' => $user ? $user->fresh() : null,
        ]);
    }

    /**
     * Upload Company Logo / Photo
     */
    public function uploadLogo(Request $request)
    {
        $request->validate([
            'logo' => 'required|image|mimes:jpeg,png,jpg,svg,webp|max:2048',
        ]);

        $user = $this->resolveCompanyUser($request);
        $company = $user ? Company::where('user_id', $user->id)->first() : Company::first();
        if (!$company) {
            return response()->json(['success' => false, 'message' => 'No company profile found.'], 404);
        }

        if ($company->logo && Storage::disk('public')->exists($company->logo)) {
            Storage::disk('public')->delete($company->logo);
        }

        $path = $request->file('logo')->store('company_logos', 'public');
        $company->update(['logo' => $path]);

        if ($user) {
            $user->update(['avatar' => $path]);
        }

        $logoUrl = asset('storage/' . $path);

        return response()->json([
            'success' => true,
            'message' => 'Photo uploaded successfully',
            'logo_url' => $logoUrl,
            'company' => $company->fresh(),
            'user' => $user ? $user->fresh() : null,
        ]);
    }

    /**
     * Get Company Job Listings
     */
    public function getMyJobs(Request $request)
    {
        $user = $this->resolveCompanyUser($request);
        $company = null;

        if ($user) {
            $company = $user->company ?? Company::where('user_id', $user->id)->first();
        }

        if (!$company && $request->filled('company_id')) {
            $company = Company::find($request->company_id);
        }

        if (!$company) {
            $company = Company::where('user_id', '!=', 1)->first() ?? Company::first();
        }

        if (!$company) {
            return response()->json(['success' => true, 'data' => []]);
        }

        $jobs = JobListing::with(['category', 'district', 'company'])
            ->withCount('applications')
            ->where('company_id', $company->id)
            ->latest()
            ->get();

        return response()->json([
            'success' => true,
            'data' => $jobs,
            'company' => $company,
        ]);
    }

    /**
     * Schedule an Interview with a Candidate
     */
    public function scheduleInterview(Request $request)
    {
        $request->validate([
            'application_id' => 'required|exists:applications,id',
            'interview_date' => 'required|date',
            'round_name' => 'required|string',
            'interview_type' => 'required|in:online,in_person',
            'meeting_link' => 'nullable|string',
            'location_address' => 'nullable|string',
            'notes' => 'nullable|string',
        ]);

        $user = $this->resolveCompanyUser($request);
        $company = null;
        if ($user) {
            $company = $user->company ?? Company::where('user_id', $user->id)->first();
        }
        if (!$company && $request->filled('company_id')) {
            $company = Company::find($request->company_id);
        }
        if (!$company) {
            $company = Company::where('user_id', '!=', 1)->first() ?? Company::first();
        }

        $application = Application::findOrFail($request->application_id);
        $companyId = $application->company_id ?? ($company ? $company->id : 1);

        $interview = Interview::create([
            'application_id' => $application->id,
            'company_id' => $companyId,
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
            'data' => $interview->load(['user.seekerProfile', 'application.jobListing', 'company']),
        ], 201);
    }

    /**
     * Get Scheduled Interviews
     */
    public function getInterviews(Request $request)
    {
        $user = auth('sanctum')->user() ?? $request->user();
        $companyId = $request->query('company_id');

        if (!$companyId && $user) {
            $company = $user->company ?? Company::where('user_id', $user->id)->first();
            if ($company) {
                $companyId = $company->id;
            }
        }

        if (!$companyId && (!$user || $user->role === 'company')) {
            $company = Company::where('user_id', '!=', 1)->first() ?? Company::first();
            if ($company) {
                $companyId = $company->id;
            }
        }

        $query = Interview::with(['user.seekerProfile', 'application.jobListing', 'company']);

        if ($companyId) {
            $query->where('company_id', $companyId);
        } elseif ($user && $user->role === 'seeker') {
            $query->where('user_id', $user->id);
        }

        $interviews = $query->orderBy('interview_date', 'asc')->get();

        return response()->json([
            'success' => true,
            'data' => $interviews,
        ]);
    }

    /**
     * Update Interview Status
     */
    public function updateInterviewStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:scheduled,completed,rescheduled,cancelled',
        ]);

        $interview = Interview::findOrFail($id);
        $interview->update([
            'status' => $request->status,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Interview status updated successfully',
            'data' => $interview->fresh()->load(['user.seekerProfile', 'application.jobListing', 'company']),
        ]);
    }
}
