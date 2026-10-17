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
     * User Login (Supports Super Admin, Employer, Job Seeker)
     */
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid email address or password.',
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
     * User Registration
     */
    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6',
            'role' => 'required|in:seeker,company',
            'phone' => 'nullable|string|max:20',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $request->role,
            'phone' => $request->phone,
            'is_active' => true,
        ]);

        // Auto-create profile container
        if ($user->role === 'seeker') {
            JobSeekerProfile::create([
                'user_id' => $user->id,
                'profile_completion' => 40,
                'skills' => [],
            ]);
            $user->load('seekerProfile');
        } elseif ($user->role === 'company') {
            Company::create([
                'user_id' => $user->id,
                'company_name' => $request->company_name ?? $user->name,
                'slug' => \Illuminate\Support\Str::slug($request->company_name ?? $user->name) . '-' . uniqid(),
                'verification_status' => 'pending',
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
