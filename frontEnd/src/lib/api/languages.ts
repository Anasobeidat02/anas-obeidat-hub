
import { ProgrammingLanguage } from '@/lib/types';
import { API_URL, getAuthToken } from './utils';

// Fetch all programming languages
export const getAllLanguages = async (): Promise<ProgrammingLanguage[]> => {
  const response = await fetch(`${API_URL}/languages`);
  if (!response.ok) {
    throw new Error('Failed to fetch programming languages');
  }
  return response.json();
};

// Fetch a single programming language by slug
export const getLanguageBySlug = async (slug: string): Promise<ProgrammingLanguage> => {
  const response = await fetch(`${API_URL}/languages/${slug}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch language with slug: ${slug}`);
  }
  return response.json();
};

// Admin functions
export const createLanguage = async (languageData: Omit<ProgrammingLanguage, 'id' | 'createdAt' | 'updatedAt'>): Promise<ProgrammingLanguage> => {
  const token = getAuthToken();
  const response = await fetch(`${API_URL}/languages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(languageData),
  });
  
  if (!response.ok) {
    throw new Error('Failed to create programming language');
  }
  return response.json();
};

export const updateLanguage = async (id: string, languageData: Partial<ProgrammingLanguage>): Promise<ProgrammingLanguage> => {
  const token = getAuthToken();
  const response = await fetch(`${API_URL}/languages/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(languageData),
  });
  
  if (!response.ok) {
    throw new Error(`Failed to update language with id: ${id}`);
  }
  return response.json();
};

export const deleteLanguage = async (id: string): Promise<void> => {
  const token = getAuthToken();
  const response = await fetch(`${API_URL}/languages/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  
  if (!response.ok) {
    throw new Error(`Failed to delete language with id: ${id}`);
  }
};
