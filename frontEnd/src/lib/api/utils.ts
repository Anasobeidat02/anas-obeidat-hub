
// Helper function to get authentication token
export const getAuthToken = () => localStorage.getItem('adminToken');

// API Base URL - configured for production
export const API_URL = 'https://learinnghub-backend.onrender.com/api';
// For local development (commented out)
// export const API_URL = 'http://localhost:5000/api';

// Helper for handling tags
export const formatTags = (tags: string[] | string | undefined): string[] => {
  if (Array.isArray(tags)) {
    return tags; 
  }
  if (typeof tags === 'string' && tags.trim()) {
    return tags.split(',').map(tag => tag.trim());
  }
  return [];
};
