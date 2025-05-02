
// Helper function to get authentication token
export const getAuthToken = () => localStorage.getItem('adminToken');

// API Base URL - can be configured based on environment
export const API_URL = 'https://learinnghub-backend.onrender.com/api'; // رابط الباك إند
  // export const API_URL = 'http://localhost:5000/api'; // رابط الباك إند محليًا

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
