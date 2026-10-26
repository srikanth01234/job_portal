<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\JobController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\DistrictController;
use App\Http\Controllers\Api\ApplicationController;
use App\Http\Controllers\Api\JobSeekerController;
use App\Http\Controllers\Api\CompanyController;
use App\Http\Controllers\Api\AdminController;

/*
|--------------------------------------------------------------------------
| Stark Jobs API Routes
|--------------------------------------------------------------------------
*/

// ==========================================
// 1. PUBLIC ROUTES (No Token Required)
// ==========================================
Route::prefix('auth')->group(function () {
    Route::post('/login', [AuthController::class, 'login'])->name('login');
    Route::post('/register', [AuthController::class, 'register']);
});

Route::get('/jobs', [JobController::class, 'index']);
Route::post('/jobs', [JobController::class, 'store']);
Route::get('/jobs/{id}', [JobController::class, 'show']);
Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/districts', [DistrictController::class, 'index']);

// Admin overview routes (readable for dashboard display)
Route::prefix('admin')->group(function () {
    Route::get('/stats', [AdminController::class, 'getStats']);
    Route::get('/companies', [AdminController::class, 'getCompanies']);
    Route::get('/job-seekers', [AdminController::class, 'getJobSeekers']);
});

// Applications endpoints (handles both authenticated user and fallback)
Route::get('/applications', [ApplicationController::class, 'index']);
Route::post('/applications', [ApplicationController::class, 'store']);
Route::put('/applications/{id}/status', [ApplicationController::class, 'updateStatus']);
Route::post('/applications/{id}/withdraw', [ApplicationController::class, 'withdraw']);

Route::prefix('seeker')->group(function () {
    Route::get('/profile', [JobSeekerController::class, 'getProfile']);
    Route::post('/profile', [JobSeekerController::class, 'updateProfile']);
    Route::post('/avatar', [JobSeekerController::class, 'uploadAvatar']);
    Route::post('/resume', [JobSeekerController::class, 'uploadResume']);
    Route::post('/extract-resume', [JobSeekerController::class, 'extractResume']);
    Route::get('/saved-jobs', [JobSeekerController::class, 'getSavedJobs']);
    Route::post('/saved-jobs/{jobId}', [JobSeekerController::class, 'toggleSaveJob']);
});
Route::prefix('company')->group(function () {
    Route::get('/profile', [CompanyController::class, 'getProfile']);
    Route::post('/profile', [CompanyController::class, 'updateProfile']);
    Route::post('/logo', [CompanyController::class, 'uploadLogo']);
    Route::get('/jobs', [CompanyController::class, 'getMyJobs']);
    Route::post('/interviews', [CompanyController::class, 'scheduleInterview']);
    Route::get('/interviews', [CompanyController::class, 'getInterviews']);
    Route::put('/interviews/{id}/status', [CompanyController::class, 'updateInterviewStatus']);
});

// ==========================================
// 2. PROTECTED ROUTES (Token Required)
// ==========================================
Route::middleware('auth:sanctum')->group(function () {
    
    // Auth helpers
    Route::prefix('auth')->group(function () {
        Route::get('/me', [AuthController::class, 'me']);
        Route::post('/logout', [AuthController::class, 'logout']);
    });

    // Company Job Management
    Route::put('/jobs/{id}', [JobController::class, 'update']);
    Route::delete('/jobs/{id}', [JobController::class, 'destroy']);

    // ------------------------------------------
    // Super Admin Mutating Endpoints
    // ------------------------------------------
    Route::prefix('admin')->group(function () {
        Route::put('/companies/{id}/verify', [AdminController::class, 'verifyCompany']);
        Route::post('/categories', [CategoryController::class, 'store']);
        Route::post('/districts', [DistrictController::class, 'store']);
    });
});
