<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\District;
use Illuminate\Http\Request;

class DistrictController extends Controller
{
    public function index()
    {
        $districts = District::withCount(['jobListings' => function ($q) {
            $q->where('status', 'active');
        }])->where('is_active', true)->orderBy('name')->get();

        return response()->json([
            'success' => true,
            'data' => $districts,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|unique:districts,name',
            'state' => 'nullable|string',
        ]);

        $district = District::create([
            'name' => $request->name,
            'state' => $request->state ?? 'Tamil Nadu',
            'is_active' => true,
        ]);

        return response()->json(['success' => true, 'data' => $district], 201);
    }
}
