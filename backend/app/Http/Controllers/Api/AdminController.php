<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Company;
use App\Models\JobListing;
use App\Models\Application;
use App\Models\District;
use App\Models\Category;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    /**
     * Super Admin Dashboard Platform Overview KPIs
     */
    public function getStats()
    {
        $stats = [
            'total_seekers' => User::where('role', 'seeker')->count(),
            'total_companies' => Company::count(),
            'active_jobs' => JobListing::where('status', 'active')->count(),
            'total_applications' => Application::count(),
            'pending_verifications' => Company::where('verification_status', 'pending')->count(),
            'verified_companies' => Company::where('verification_status', 'verified')->count(),
        ];

        // Recent 5 applications across the platform
        $recentApplications = Application::with(['jobListing.company', 'user'])
            ->latest()
            ->limit(5)
            ->get();

        // Recent 5 companies registered
        $recentCompanies = Company::with('user')
            ->latest()
            ->limit(5)
            ->get();

        return response()->json([
            'success' => true,
            'stats' => $stats,
            'recent_applications' => $recentApplications,
            'recent_companies' => $recentCompanies,
        ]);
    }

    /**
     * Get All Companies for Admin Moderation
     */
    public function getCompanies(Request $request)
    {
        $query = Company::with(['user', 'district'])->withCount('jobListings');

        if ($request->filled('status')) {
            $query->where('verification_status', $request->status);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where('company_name', 'like', "%{$search}%");
        }

        $companies = $query->latest()->get();

        return response()->json([
            'success' => true,
            'data' => $companies,
        ]);
    }

    /**
     * Verify or Reject Company
     */
    public function verifyCompany(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:verified,rejected,pending',
        ]);

        $company = Company::findOrFail($id);
        $company->update(['verification_status' => $request->status]);

        return response()->json([
            'success' => true,
            'message' => "Company verification status updated to {$request->status}.",
            'company' => $company,
        ]);
    }

    /**
     * Get All Job Seekers for Admin
     */
    public function getJobSeekers(Request $request)
    {
        $query = User::with('seekerProfile.district')->where('role', 'seeker');

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('phone', 'like', "%{$search}%");
            });
        }

        $seekers = $query->latest()->paginate(20);

        return response()->json([
            'success' => true,
            'data' => $seekers->items(),
            'total' => $seekers->total(),
            'current_page' => $seekers->currentPage(),
            'last_page' => $seekers->lastPage(),
        ]);
    }
}
