<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class JobSeekerProfile extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'headline',
        'district_id',
        'current_location',
        'experience_level',
        'expected_salary',
        'resume_path',
        'resume_filename',
        'linkedin_url',
        'github_url',
        'portfolio_url',
        'professional_summary',
        'skills',
        'education',
        'work_history',
        'preferred_locations',
        'profile_completion',
    ];

    protected function casts(): array
    {
        return [
            'skills' => 'array',
            'education' => 'array',
            'work_history' => 'array',
            'preferred_locations' => 'array',
            'expected_salary' => 'decimal:2',
            'profile_completion' => 'integer',
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function district()
    {
        return $this->belongsTo(District::class);
    }
}
