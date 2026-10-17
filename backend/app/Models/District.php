<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class District extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'state', 'is_active'];

    public function jobListings()
    {
        return $this->hasMany(JobListing::class);
    }

    public function companies()
    {
        return $this->hasMany(Company::class);
    }
}
