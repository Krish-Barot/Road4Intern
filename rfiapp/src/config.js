// API Configuration
// Use environment variable in production, fallback for development
const API_BASE_URL = process.env.REACT_APP_API_URL ;
const JOBS_API_BASE_URL = process.env.REACT_APP_JOBS_API_URL;

// Log for debugging (remove in production if needed)
console.log('API_BASE_URL:', API_BASE_URL);
console.log('JOBS_API_BASE_URL:', JOBS_API_BASE_URL);

export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: `${API_BASE_URL}/api/auth`,
  USERS: `${API_BASE_URL}/api/users`,
  
  // Jobs endpoints
  JOBS_DATA: `${JOBS_API_BASE_URL}/data`,
  FILTERED_JOBS: `${JOBS_API_BASE_URL}/filteredJobs`,
  JOB_DETAILS: (id) => `${JOBS_API_BASE_URL}/jobdetails/${id}`,
  APPLICATION: `${JOBS_API_BASE_URL}/application`,
  APPLICATION_HISTORY: (userId) => `${JOBS_API_BASE_URL}/application-history/${userId}`,
  CONTACT_US: `${JOBS_API_BASE_URL}/contactUs`,
  USERS_COUNT: `${JOBS_API_BASE_URL}/api/users/count`,
  COMPANY_COUNT: `${JOBS_API_BASE_URL}/api/company/count`,
};

