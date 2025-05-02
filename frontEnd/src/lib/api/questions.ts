
import { Question } from '../types/question';
import { API_URL, getAuthToken } from './utils';

export const getQuestionLanguages = async (): Promise<string[]> => {
  try {
    const response = await fetch(`${API_URL}/questions/languages`);
    if (!response.ok) throw new Error('Failed to fetch question languages');
    return await response.json();
  } catch (error) {
    console.error('Error fetching question languages:', error);
    throw error;
  }
};

export const getAllQuestions = async (): Promise<Question[]> => {
  try {
    const response = await fetch(`${API_URL}/questions`);
    if (!response.ok) throw new Error('Failed to fetch questions');
    return await response.json();
  } catch (error) {
    console.error('Error fetching questions:', error);
    throw error;
  }
};

export const getQuestionsByLanguage = async (language: string): Promise<Question[]> => {
  try {
    const response = await fetch(`${API_URL}/questions/language/${language}`);
    if (!response.ok) throw new Error(`Failed to fetch ${language} questions`);
    return await response.json();
  } catch (error) {
    console.error(`Error fetching ${language} questions:`, error);
    throw error;
  }
};

export const getQuestionsByDifficulty = async (difficulty: string): Promise<Question[]> => {
  try {
    const response = await fetch(`${API_URL}/questions/difficulty/${difficulty}`);
    if (!response.ok) throw new Error(`Failed to fetch ${difficulty} questions`);
    return await response.json();
  } catch (error) {
    console.error(`Error fetching ${difficulty} questions:`, error);
    throw error;
  }
};

export const createQuestion = async (questionData: Omit<Question, '_id'>): Promise<Question> => {
  const token = getAuthToken();
  if (!token) throw new Error('Not authenticated');

  try {
    const response = await fetch(`${API_URL}/questions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(questionData),
    });
    
    if (!response.ok) throw new Error('Failed to create question');
    return await response.json();
  } catch (error) {
    console.error('Error creating question:', error);
    throw error;
  }
};

export const updateQuestion = async (id: string, questionData: Partial<Question>): Promise<Question> => {
  const token = getAuthToken();
  if (!token) throw new Error('Not authenticated');

  try {
    const response = await fetch(`${API_URL}/questions/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(questionData),
    });
    
    if (!response.ok) throw new Error('Failed to update question');
    return await response.json();
  } catch (error) {
    console.error('Error updating question:', error);
    throw error;
  }
};

export const deleteQuestion = async (id: string): Promise<void> => {
  const token = getAuthToken();
  if (!token) throw new Error('Not authenticated');

  try {
    const response = await fetch(`${API_URL}/questions/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    if (!response.ok) throw new Error('Failed to delete question');
  } catch (error) {
    console.error('Error deleting question:', error);
    throw error;
  }
};
