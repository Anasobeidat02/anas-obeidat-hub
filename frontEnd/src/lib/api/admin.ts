
import { API_URL, getAuthToken } from './utils';

export const loginAdmin = async (email: string, password: string) => {
  try {
    const response = await fetch(`${API_URL}/admins/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Login failed');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const registerAdmin = async (adminData: { username: string; email: string; password: string; role?: string }) => {
  const token = getAuthToken();
  if (!token) throw new Error('Not authenticated');

  try {
    const response = await fetch(`${API_URL}/admins`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(adminData),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Registration failed');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

export const getAdminProfile = async (token: string) => {
  try {
    const response = await fetch(`${API_URL}/admins/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    if (!response.ok) throw new Error('Failed to fetch admin profile');
    return await response.json();
  } catch (error) {
    console.error('Error fetching admin profile:', error);
    throw error;
  }
};

export const getAllAdmins = async (token: string) => {
  try {
    const response = await fetch(`${API_URL}/admins`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    if (!response.ok) throw new Error('Failed to fetch admins');
    return await response.json();
  } catch (error) {
    console.error('Error fetching admins:', error);
    throw error;
  }
};
