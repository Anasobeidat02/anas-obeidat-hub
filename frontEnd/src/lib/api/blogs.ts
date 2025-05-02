
import { Blog } from '@/lib/types';
import { API_URL, getAuthToken } from './utils';

// Fetch all blogs
export const getAllBlogs = async (): Promise<Blog[]> => {
  const response = await fetch(`${API_URL}/blogs`);
  if (!response.ok) {
    throw new Error('Failed to fetch blogs');
  }
  return response.json();
};

// Fetch a single blog by slug
export const getBlogBySlug = async (slug: string): Promise<Blog> => {
  const response = await fetch(`${API_URL}/blogs/${slug}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch blog with slug: ${slug}`);
  }
  return response.json();
};

// Admin functions
export const createBlog = async (blogData: Omit<Blog, 'id' | 'createdAt' | 'updatedAt'>): Promise<Blog> => {
  const token = getAuthToken();
  const response = await fetch(`${API_URL}/blogs`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(blogData),
  });
  
  if (!response.ok) {
    throw new Error('Failed to create blog');
  }
  return response.json();
};

export const updateBlog = async (id: string, blogData: Partial<Blog>): Promise<Blog> => {
  const token = getAuthToken();
  const response = await fetch(`${API_URL}/blogs/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(blogData),
  });
  
  if (!response.ok) {
    throw new Error(`Failed to update blog with id: ${id}`);
  }
  return response.json();
};

export const deleteBlog = async (id: string): Promise<void> => {
  const token = getAuthToken();
  const response = await fetch(`${API_URL}/blogs/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  
  if (!response.ok) {
    throw new Error(`Failed to delete blog with id: ${id}`);
  }
};
