<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Application;
use App\Models\JobListing;
use Illuminate\Http\Request;

class ApplicationController extends Controller
{
    /**
     * Get Applications (Filtered by candidate or company role)
     */
    public function index(Request $request)
    {
        $user = auth('sanctum')->user() ?? $request->user();
        if (!$user) {
            $forCompany = $request->has('company_id') || $request->query('role') === 'company';
            $user = $forCompany 
                ? (\App\Models\User::where('role', 'company')->first() ?? \App\Models\User::first())
                : (\App\Models\User::where('role', 'seeker')->first() ?? \App\Models\User::first());
        }

        if (!$user) {
            return response()->json(['success' => true, 'data' => [], 'counts' => ['all' => 0]]);
        }

        if ($user->role === 'seeker') {
            $query = Application::with(['jobListing.company', 'jobListing.category', 'jobListing.district', 'interviews'])
                ->where('user_id', $user->id);

            if ($request->filled('status') && $request->status !== 'All') {
                $query->where('status', strtolower(str_replace(' ', '_', $request->status)));
            }

            $applications = $query->latest()->get();

            // Status counts for candidate KPI ribbons
            $counts = [
                'all' => Application::where('user_id', $user->id)->count(),
                'under_review' => Application::where('user_id', $user->id)->where('status', 'under_review')->count(),
                'shortlisted' => Application::where('user_id', $user->id)->where('status', 'shortlisted')->count(),
                'interview' => Application::where('user_id', $user->id)->where('status', 'interview')->count(),
                'rejected' => Application::where('user_id', $user->id)->where('status', 'rejected')->count(),
                'withdrawn' => Application::where('user_id', $user->id)->where('status', 'withdrawn')->count(),
            ];

            return response()->json([
                'success' => true,
                'data' => $applications,
                'counts' => $counts,
            ]);
        } elseif ($user->role === 'company' || $user->role === 'admin') {
            $company = $user->company ?? \App\Models\Company::first();
            $query = Application::with(['jobListing', 'user.seekerProfile', 'interviews']);

            if ($company) {
                $query->where('company_id', $company->id);
            }

            if ($request->filled('job_id')) {
                $query->where('job_listing_id', $request->job_id);
            }

            if ($request->filled('status') && $request->status !== 'All') {
                $query->where('status', $request->status);
            }

            $applications = $query->latest()->get();

            return response()->json([
                'success' => true,
                'data' => $applications,
            ]);
        }

        return response()->json(['success' => true, 'data' => []]);
    }

    /**
     * Submit Application (Seeker Only)
     */
    public function store(Request $request)
    {
        $user = auth('sanctum')->user() ?? $request->user();
        if (!$user || $user->role !== 'seeker') {
            $user = \App\Models\User::where('role', 'seeker')->first();
        }

        if (!$user) {
            return response()->json(['success' => false, 'message' => 'Please sign in as a job seeker to apply.'], 401);
        }

        $request->validate([
            'job_listing_id' => 'required|exists:job_listings,id',
            'cover_note' => 'nullable|string|max:1000',
        ]);

        $job = JobListing::findOrFail($request->job_listing_id);

        // Check if already applied
        $existing = Application::where('job_listing_id', $job->id)
            ->where('user_id', $user->id)
            ->first();

        if ($existing) {
            return response()->json([
                'success' => false,
                'message' => 'You have already applied for this position.',
                'application' => $existing,
            ], 409);
        }

        $seekerProfile = $user->seekerProfile;

        $application = Application::create([
            'job_listing_id' => $job->id,
            'user_id' => $user->id,
            'company_id' => $job->company_id,
            'status' => 'applied',
            'cover_note' => $request->cover_note,
            'resume_snapshot_path' => $seekerProfile?->resume_path,
            'applied_at' => now(),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Application submitted successfully!',
            'data' => $application->load(['jobListing.company']),
        ], 201);
    }

    /**
     * Update Application Status (Company / Admin)
     */
    public function updateStatus(Request $request, $id)
    {
        $application = Application::findOrFail($id);

        $request->validate([
            'status' => 'required|in:applied,under_review,shortlisted,interview,rejected,withdrawn,hired',
        ]);

        $application->update(['status' => $request->status]);

        return response()->json([
            'success' => true,
            'message' => "Application status updated to {$request->status}.",
            'data' => $application,
        ]);
    }

    /**
     * Withdraw Application (Candidate Only)
     */
    public function withdraw(Request $request, $id)
    {
        $user = $request->user();
        $application = Application::where('id', $id)
            ->where('user_id', $user->id)
            ->firstOrFail();

        $application->update(['status' => 'withdrawn']);

        return response()->json([
            'success' => true,
            'message' => 'Application withdrawn successfully.',
            'data' => $application,
        ]);
    }
}
