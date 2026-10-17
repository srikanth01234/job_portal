/**
 * Centralized API Service for Stark Jobs
 * Connects React frontend to the Laravel Backend (http://127.0.0.1:8000/api)
 */

const API_BASE_URL = 'http://127.0.0.1:8000/api';

// Helper to get stored auth token
export const getToken = () => localStorage.getItem('stark_token');
export const setToken = (token) => localStorage.setItem('stark_token', token);
export const removeToken = () => {
  localStorage.removeItem('stark_token');
  localStorage.removeItem('stark_user');
};

export const getStoredUser = () => {
  try {
    const user = localStorage.getItem('stark_user');
    return user ? JSON.parse(user) : null;
  } catch (e) {
    return null;
  }
};

export const setStoredUser = (user) => {
  localStorage.setItem('stark_user', JSON.stringify(user));
};

// Generic fetch wrapper with auth header and error handling
async function request(endpoint, options = {}) {
  const token = getToken();
  const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || `Request failed with status ${res.status}`);
    }
    return data;
  } catch (error) {
    console.warn(`API call error on ${endpoint}:`, error.message);
    throw error;
  }
}

export const api = {
  // Authentication
  login: async (email, password) => {
    const data = await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    if (data.token) {
      setToken(data.token);
      setStoredUser(data.user);
    }
    return data;
  },

  register: async (userData) => {
    const data = await request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    if (data.token) {
      setToken(data.token);
      setStoredUser(data.user);
    }
    return data;
  },

  logout: async () => {
    try {
      await request('/auth/logout', { method: 'POST' });
    } finally {
      removeToken();
    }
  },

  getCurrentUser: () => request('/auth/me'),

  // Public Lookups
  getCategories: () => request('/categories'),
  getDistricts: () => request('/districts'),

  // Jobs
  getJobs: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/jobs${query ? `?${query}` : ''}`);
  },

  getJobById: (id) => request(`/jobs/${id}`),

  createJob: (jobData) => request('/jobs', {
    method: 'POST',
    body: JSON.stringify(jobData),
  }),

  updateJob: (id, jobData) => request(`/jobs/${id}`, {
    method: 'PUT',
    body: JSON.stringify(jobData),
  }),

  deleteJob: (id) => request(`/jobs/${id}`, {
    method: 'DELETE',
  }),

  // Company / Employer
  getCompanyProfile: () => request('/company/profile'),
  updateCompanyProfile: (data) => request('/company/profile', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  getCompanyJobs: () => request('/company/jobs'),
  getCompanyInterviews: () => request('/company/interviews'),
  scheduleInterview: (interviewData) => request('/company/interviews', {
    method: 'POST',
    body: JSON.stringify(interviewData),
  }),

  // Applications
  getApplications: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/applications${query ? `?${query}` : ''}`);
  },

  applyForJob: (jobListingId, coverNote = '') => request('/applications', {
    method: 'POST',
    body: JSON.stringify({ job_listing_id: jobListingId, cover_note: coverNote }),
  }),

  updateApplicationStatus: (id, status) => request(`/applications/${id}/status`, {
    method: 'PUT',
    body: JSON.stringify({ status }),
  }),

  withdrawApplication: (id) => request(`/applications/${id}/withdraw`, {
    method: 'POST',
  }),

  // Job Seeker
  getSeekerProfile: () => request('/seeker/profile'),
  updateSeekerProfile: (data) => request('/seeker/profile', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  getSavedJobs: () => request('/seeker/saved-jobs'),
  toggleSaveJob: (jobId) => request(`/seeker/saved-jobs/${jobId}`, {
    method: 'POST',
  }),

  // Super Admin
  getAdminStats: () => request('/admin/stats'),
  getAdminCompanies: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/admin/companies${query ? `?${query}` : ''}`);
  },
  verifyCompany: (id, status) => request(`/admin/companies/${id}/verify`, {
    method: 'PUT',
    body: JSON.stringify({ status }),
  }),
  getAdminJobSeekers: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/admin/job-seekers${query ? `?${query}` : ''}`);
  },
};

export default api;
