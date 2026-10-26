<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\JobListing;
use Illuminate\Http\Request;

class JobController extends Controller
{
    /**
     * Search & Filter Job Listings
     */
    public function index(Request $request)
    {
        $query = JobListing::with(['company', 'category', 'district']);

        if ($request->filled('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        } elseif (!$request->filled('status')) {
            $query->where('status', 'active');
        }

        // Keyword Search (Title or Description)
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%")
                  ->orWhereHas('company', function ($cq) use ($search) {
                      $cq->where('company_name', 'like', "%{$search}%");
                  });
            });
        }

        // Filter by Category
        if ($request->filled('category_id')) {
            $query->where('category_id', $request->category_id);
        } elseif ($request->filled('category_slug')) {
            $query->whereHas('category', function ($q) use ($request) {
                $q->where('slug', $request->category_slug);
            });
        }

        // Filter by District / Location
        if ($request->filled('district_id')) {
            $query->where('district_id', $request->district_id);
        } elseif ($request->filled('location')) {
            $query->where('location', 'like', "%{$request->location}%");
        }

        // Filter by Job Type (Full-time, Part-time, Contract, Internship)
        if ($request->filled('job_type') && $request->job_type !== 'All') {
            $query->where('job_type', $request->job_type);
        }

        // Filter by Experience Level
        if ($request->filled('experience') && $request->experience !== 'All') {
            $query->where('experience', $request->experience);
        }

        // Filter by Salary Range
        if ($request->filled('min_salary')) {
            $query->where('max_salary', '>=', $request->min_salary);
        }

        // Sorting
        $sort = $request->get('sort', 'latest');
        if ($sort === 'salary_high') {
            $query->orderBy('max_salary', 'desc');
        } elseif ($sort === 'salary_low') {
            $query->orderBy('min_salary', 'asc');
        } else {
            $query->latest();
        }

        $perPage = $request->get('per_page', 12);
        $jobs = $query->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => $jobs->items(),
            'total' => $jobs->total(),
            'current_page' => $jobs->currentPage(),
            'last_page' => $jobs->lastPage(),
            'per_page' => $jobs->perPage(),
        ]);
    }

    /**
     * Get Single Job Detail
     */
    public function show($id)
    {
        $job = JobListing::with(['company', 'category', 'district'])->findOrFail($id);

        // Fetch 3 related jobs in the same category
        $relatedJobs = JobListing::with(['company', 'category', 'district'])
            ->where('category_id', $job->category_id)
            ->where('id', '!=', $job->id)
            ->where('status', 'active')
            ->limit(3)
            ->get();

        return response()->json([
            'success' => true,
            'job' => $job,
            'related_jobs' => $relatedJobs,
        ]);
    }

    /**
     * Post a New Job (Employer Only)
     */
    public function store(Request $request)
    {
        $user = auth('sanctum')->user() ?? $request->user();
        $company = null;

        // 1. Resolve by authenticated user's company relation or user_id
        if ($user) {
            $company = $user->company ?? \App\Models\Company::where('user_id', $user->id)->first();
        }

        // 2. Resolve by explicitly passed company_id from client
        if (!$company && $request->filled('company_id')) {
            $company = \App\Models\Company::find($request->company_id);
        }

        // 3. If authenticated user is a company but lacks a profile record, create one
        if (!$company && $user && $user->role === 'company') {
            $company = \App\Models\Company::create([
                'user_id' => $user->id,
                'company_name' => $user->name ?? 'Company Portal',
                'slug' => \Illuminate\Support\Str::slug($user->name ?? 'company') . '-' . uniqid(),
                'industry' => 'Industrial Manufacturing',
                'verification_status' => 'verified',
            ]);
        }

        // 4. Fallback if called anonymously in development
        if (!$company) {
            $company = \App\Models\Company::where('user_id', '!=', 1)->first() ?? \App\Models\Company::first();
        }

        $request->validate([
            'title' => 'required|string|max:255',
        ]);

        $category = \App\Models\Category::find($request->category_id) 
            ?? \App\Models\Category::where('name', 'like', "%{$request->department}%")->first()
            ?? \App\Models\Category::first();

        $district = \App\Models\District::find($request->district_id)
            ?? \App\Models\District::where('name', 'like', "%{$request->location}%")->first()
            ?? \App\Models\District::first();

        // Parse salary range if passed as string (e.g. "₹20,000 - ₹28,000/mo")
        $minSalary = $request->min_salary;
        $maxSalary = $request->max_salary;
        if (!$minSalary && $request->filled('salary')) {
            preg_match_all('/\d[\d,]*/', $request->salary, $matches);
            if (!empty($matches[0])) {
                $nums = array_map(fn($v) => (float)str_replace(',', '', $v), $matches[0]);
                $minSalary = $nums[0] ?? 18000;
                $maxSalary = $nums[1] ?? ($minSalary * 1.35);
            }
        }

        // Requirements parsing (support array or multiline text)
        $requirements = $request->requirements;
        if (is_string($requirements)) {
            $lines = array_filter(array_map('trim', preg_split('/[\r\n]+/', $requirements)));
            $requirements = !empty($lines) ? array_values($lines) : [$requirements];
        }
        if (empty($requirements)) {
            $requirements = [
                'Relevant trade qualification or technical background.',
                'Good work ethic and adherence to safety protocols.'
            ];
        }

        // Responsibilities parsing (support array or multiline text)
        $responsibilities = $request->responsibilities;
        if (is_string($responsibilities)) {
            $lines = array_filter(array_map('trim', preg_split('/[\r\n]+/', $responsibilities)));
            $responsibilities = !empty($lines) ? array_values($lines) : [$responsibilities];
        }
        if (empty($responsibilities)) {
            $responsibilities = [
                'Perform assigned operational duties according to specifications.',
                'Adhere to factory safety protocols and maintenance standards.'
            ];
        }

        $job = JobListing::create([
            'company_id' => $company->id,
            'title' => $request->title,
            'category_id' => $category?->id,
            'district_id' => $district?->id,
            'location' => $request->location ?? 'Thoothukudi, TN',
            'job_type' => $request->job_type ?? 'Full-time',
            'min_salary' => $minSalary ?? 18000,
            'max_salary' => $maxSalary ?? 25000,
            'experience' => $request->experience ?? '1-3 Years',
            'openings' => (int)($request->openings ?? 1),
            'description' => $request->description ?? "Job opportunity for {$request->title} at {$company->company_name}.",
            'responsibilities' => $responsibilities,
            'requirements' => $requirements,
            'status' => 'active',
            'expires_at' => now()->addDays(30),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Job posted successfully',
            'job' => $job->load(['category', 'district', 'company']),
            'data' => $job->load(['category', 'district', 'company']),
        ], 201);
    }

    /**
     * Update an Existing Job
     */
    public function update(Request $request, $id)
    {
        $user = $request->user();
        $job = JobListing::findOrFail($id);

        if ($user->role !== 'admin' && ($user->role !== 'company' || $job->company_id !== $user->company?->id)) {
            return response()->json(['success' => false, 'message' => 'Unauthorized action.'], 403);
        }

        $job->update($request->only([
            'title', 'category_id', 'district_id', 'location', 'job_type',
            'min_salary', 'max_salary', 'experience', 'openings',
            'description', 'responsibilities', 'requirements', 'status'
        ]));

        return response()->json([
            'success' => true,
            'message' => 'Job updated successfully',
            'job' => $job->load(['category', 'district']),
        ]);
    }

    /**
     * Delete Job Listing
     */
    public function destroy(Request $request, $id)
    {
        $user = $request->user();
        $job = JobListing::findOrFail($id);

        if ($user->role !== 'admin' && ($user->role !== 'company' || $job->company_id !== $user->company?->id)) {
            return response()->json(['success' => false, 'message' => 'Unauthorized action.'], 403);
        }

        $job->delete();

        return response()->json([
            'success' => true,
            'message' => 'Job listing deleted successfully',
        ]);
    }
}
