<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\District;
use App\Models\Category;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed only essential platform base data (Districts, Categories, Super Admin).
     * No fake demo companies, jobs, candidates, or applications.
     */
    public function run(): void
    {
        // 1. Seed Essential Tamil Nadu Districts
        $districtsData = [
            'Thoothukudi',
            'Chennai',
            'Coimbatore',
            'Madurai',
            'Tirunelveli',
            'Tiruchirappalli',
            'Salem',
            'Erode',
            'Vellore',
            'Thanjavur',
            'Dindigul',
            'Kanyakumari',
        ];

        foreach ($districtsData as $name) {
            District::create([
                'name' => $name,
                'state' => 'Tamil Nadu',
                'is_active' => true,
            ]);
        }

        // 2. Seed Essential Trade Categories
        $categoriesData = [
            ['name' => 'Electrical & Electronics', 'slug' => 'electrical-electronics', 'icon' => 'Zap', 'description' => 'Industrial electricians, wiring, transformers, control panel technicians.'],
            ['name' => 'Mechanical & Machinery', 'slug' => 'mechanical-machinery', 'icon' => 'Wrench', 'description' => 'CNC operators, lathe machinists, pump technicians, hydraulic maintenance.'],
            ['name' => 'Fabrication & Welding', 'slug' => 'fabrication-welding', 'icon' => 'Flame', 'description' => 'TIG/MIG welders, structural fitters, pipe fabricators.'],
            ['name' => 'Automotive & Garage', 'slug' => 'automotive-garage', 'icon' => 'Car', 'description' => 'Two-wheeler and heavy vehicle technicians, diesel mechanics.'],
            ['name' => 'Construction & Civil Trades', 'slug' => 'construction-civil-trades', 'icon' => 'Hammer', 'description' => 'Masonry, plumbing, painting, bar bending, tile laying.'],
            ['name' => 'Teaching & Education', 'slug' => 'teaching-education', 'icon' => 'GraduationCap', 'description' => 'Trade instructors, vocational trainers, school and academy faculty.'],
            ['name' => 'Logistics & Warehousing', 'slug' => 'logistics-warehousing', 'icon' => 'Truck', 'description' => 'Forklift operators, inventory supervisors, dispatch coordinators.'],
            ['name' => 'Textile & Garment Operations', 'slug' => 'textile-garment-operations', 'icon' => 'Scissors', 'description' => 'Spinning technicians, loom operators, industrial tailoring.'],
        ];

        foreach ($categoriesData as $c) {
            Category::create($c);
        }

        // 3. Seed Root Super Admin (Required to manage the platform)
        User::create([
            'name' => 'Super Administrator',
            'email' => 'superadmin@starkjobs.com',
            'password' => Hash::make('StarkAdmin#2026'),
            'role' => 'admin',
            'phone' => '+91 99999 88888',
            'is_active' => true,
        ]);
    }
}
