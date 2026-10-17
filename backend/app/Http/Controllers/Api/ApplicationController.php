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
        $user = $request->user();

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
        } elseif ($user->role === 'company' && $user->company) {
            $query = Application::with(['jobListing', 'user.seekerProfile', 'interviews'])
                ->where('company_id', $user->company->id);

            if ($request->filled('job_id')) {
                $query->where('job_listing_id', $request->job_id);
            }

            if ($request->filled('status')) {
                $query->where('status', $request->status);
            }

            $applications = $query->latest()->get();

            return response()->json([
                'success' => true,
                'data' => $applications,
            ]);
        }

        return response()->json(['success' => false, 'message' => 'Unauthorized role.'], 403);
    }

    /**
     * Submit Application (Seeker Only)
     */
    public function store(Request $request)
    {
        $user = $request->user();
        if ($user->role !== 'seeker') {
            return response()->json(['success' => false, 'message' => 'Only job seekers can apply for jobs.'], 403);
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
        $user = $request->user();
        $application = Application::findOrFail($id);

        if ($user->role !== 'admin' && ($user->role !== 'company' || $application->company_id !== $user->company?->id)) {
            return response()->json(['success' => false, 'message' => 'Unauthorized.'], 403);
        }

        $request->validate([
            'status' => 'required|in:applied,under_review,shortlisted,interview,rejected,withdrawn',
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
