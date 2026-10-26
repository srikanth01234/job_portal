<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\JobSeekerProfile;
use App\Models\Company;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * User Login (Supports Super Admin, Employer, Job Seeker using Username OR Email + Password)
     */
    public function login(Request $request)
    {
        $request->validate([
            'login' => 'nullable|string',
            'email' => 'nullable|string',
            'username' => 'nullable|string',
            'password' => 'required|string',
        ]);

        $identifier = trim($request->login ?? $request->email ?? $request->username ?? '');

        if (!$identifier) {
            return response()->json([
                'success' => false,
                'message' => 'Please enter your username or email address.',
            ], 422);
        }

        // Match by email or username (name)
        $user = User::where('email', $identifier)
            ->orWhere('name', $identifier)
            ->first();

        // Special fallback: allow typing "admin" or "superadmin" to resolve root admin
        if (!$user && in_array(strtolower($identifier), ['admin', 'superadmin', 'administrator'])) {
            $user = User::where('role', 'admin')->first();
        }

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid username/email or password.',
            ], 401);
        }

        if (!$user->is_active) {
            return response()->json([
                'success' => false,
                'message' => 'This account has been deactivated. Please contact support.',
            ], 403);
        }

        // Generate Sanctum API Token
        $token = $user->createToken('stark_auth_token')->plainTextToken;

        // Load associated profile based on role
        if ($user->role === 'seeker') {
            $user->load('seekerProfile');
        } elseif ($user->role === 'company') {
            $user->load('company');
        }

        return response()->json([
            'success' => true,
            'message' => 'Login successful',
            'token' => $token,
            'user' => $user,
        ]);
    }

    /**
     * User Registration (Supports Seeker, Company, and Super Admin with extra profile details)
     */
    public function register(Request $request)
    {
        $request->validate([
            'password' => 'required|string|min:4',
            'role' => 'nullable|in:seeker,company,admin',
        ]);

        $role = $request->role ?? 'seeker';
        $email = strtolower(trim($request->email ?? $request->login ?? ''));
        $name = trim($request->name ?? $request->username ?? '');
        $phone = trim($request->phone ?? '');
        $companyName = trim($request->company_name ?? '');

        // If email was given as login/username or vice-versa
        if (!$email && $request->filled('login')) {
            $identifier = trim($request->login);
            if (filter_var($identifier, FILTER_VALIDATE_EMAIL)) {
                $email = strtolower($identifier);
            } else {
                $cleanUser = preg_replace('/[^a-zA-Z0-9_]/', '', strtolower($identifier));
                $email = ($cleanUser ?: 'user_' . uniqid()) . '@starkjobs.com';
                if (!$name) $name = $identifier;
            }
        }

        if (!$email) {
            return response()->json([
                'success' => false,
                'message' => 'Please provide a valid email address.',
            ], 422);
        }

        if (!$name) {
            $name = ($role === 'company' && $companyName) ? $companyName : ucfirst(explode('@', $email)[0]);
        }

        // Security check for Super Admin creation
        if ($role === 'admin') {
            $secret = trim($request->admin_secret ?? '');
            $adminCount = User::where('role', 'admin')->count();
            if ($adminCount > 0 && $secret !== 'starkadmin2026') {
                return response()->json([
                    'success' => false,
                    'message' => 'Invalid Super Admin Passcode. Use "starkadmin2026" to register a new Super Admin.',
                ], 403);
            }
        }

        // Check uniqueness in database
        if (User::where('email', $email)->exists()) {
            return response()->json([
                'success' => false,
                'message' => 'An account with email "' . $email . '" already exists. Please sign in.',
            ], 409);
        }

        $user = User::create([
            'name' => $name,
            'email' => $email,
            'phone' => $phone ?: null,
            'password' => Hash::make($request->password),
            'role' => $role,
            'is_active' => true,
        ]);

        // Auto-create associated profile container in database
        if ($user->role === 'seeker') {
            JobSeekerProfile::create([
                'user_id' => $user->id,
                'profile_completion' => 35,
                'skills' => [],
            ]);
            $user->load('seekerProfile');
        } elseif ($user->role === 'company') {
            $finalCompName = $companyName ?: $name;
            $company = Company::create([
                'user_id' => $user->id,
                'company_name' => $finalCompName,
                'slug' => \Illuminate\Support\Str::slug($finalCompName) . '-' . uniqid(),
                'phone' => $phone ?: null,
                'email' => $email,
                'industry' => $request->industry ?? 'Industrial & Manufacturing',
                'verification_status' => 'verified',
            ]);
            $user->load('company');
        }

        $token = $user->createToken('stark_auth_token')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Account registered successfully',
            'token' => $token,
            'user' => $user,
        ], 201);
    }

    /**
     * Get Current Authenticated User Info
     */
    public function me(Request $request)
    {
        $user = $request->user();

        if ($user->role === 'seeker') {
            $user->load('seekerProfile.district');
        } elseif ($user->role === 'company') {
            $user->load('company.district');
        }

        return response()->json([
            'success' => true,
            'user' => $user,
        ]);
    }

    /**
     * Logout & Revoke Current Token
     */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'success' => true,
            'message' => 'Logged out successfully',
        ]);
    }
}
