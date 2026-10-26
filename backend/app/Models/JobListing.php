<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class JobListing extends Model
{
    use HasFactory;

    protected $appends = ['salary_range'];

    public function getSalaryRangeAttribute()
    {
        if ($this->min_salary && $this->max_salary) {
            return '₹' . number_format($this->min_salary) . ' - ₹' . number_format($this->max_salary);
        } elseif ($this->min_salary) {
            return 'From ₹' . number_format($this->min_salary);
        } elseif ($this->max_salary) {
            return 'Up to ₹' . number_format($this->max_salary);
        }
        return 'Not Disclosed';
    }

    protected $fillable = [
        'company_id',
        'title',
        'category_id',
        'district_id',
        'location',
        'job_type',
        'min_salary',
        'max_salary',
        'salary_currency',
        'experience',
        'openings',
        'description',
        'responsibilities',
        'requirements',
        'status',
        'expires_at',
    ];

    protected function casts(): array
    {
        return [
            'responsibilities' => 'array',
            'requirements' => 'array',
            'min_salary' => 'decimal:2',
            'max_salary' => 'decimal:2',
            'expires_at' => 'date',
        ];
    }

    public function company()
    {
        return $this->belongsTo(Company::class);
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function district()
    {
        return $this->belongsTo(District::class);
    }

    public function applications()
    {
        return $this->hasMany(Application::class);
    }

    public function savedJobs()
    {
        return $this->hasMany(SavedJob::class);
    }
}
