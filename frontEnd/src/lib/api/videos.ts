
import { Video } from '../types';
import { API_URL, getAuthToken, formatTags } from './utils';
import { allVideos } from '../data';

export const getFeaturedVideos = async (): Promise<Video[]> => {
  try {
    const response = await fetch(`${API_URL}/videos/featured`);
    if (!response.ok) throw new Error('Failed to fetch featured videos');
    return await response.json();
  } catch (error) {
    console.error('Error fetching featured videos:', error);
    return allVideos.filter((_, index) => index < 4);
  }
};

export const getAllVideos = async (): Promise<Video[]> => {
  try {
    const response = await fetch(`${API_URL}/videos`);
    if (!response.ok) throw new Error('Failed to fetch videos');
    return await response.json();
  } catch (error) {
    console.error('Error fetching videos:', error);
    return allVideos;
  }
};

export const getVideoById = async (id: string): Promise<Video | undefined> => {
  try {
    const response = await fetch(`${API_URL}/videos/${id}`);
    if (!response.ok) throw new Error('Failed to fetch video');
    return await response.json();
  } catch (error) {
    console.error('Error fetching video:', error);
    return allVideos.find(video => video.id === id);
  }
};

export const getVideosByCategory = async (category: string): Promise<Video[]> => {
  try {
    const url = category === 'All' 
      ? `${API_URL}/videos` 
      : `${API_URL}/videos/category/${category}`;
    
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch videos by category');
    return await response.json();
  } catch (error) {
    console.error('Error fetching videos by category:', error);
    return category === 'All' 
      ? allVideos 
      : allVideos.filter(video => video.category === category);
  }
};

export const getVideosByPlaylist = async (playlist: string): Promise<Video[]> => {
  try {
    const response = await fetch(`${API_URL}/videos/playlist/${playlist}`);
    if (!response.ok) throw new Error('Failed to fetch videos by playlist');
    return await response.json();
  } catch (error) {
    console.error('Error fetching videos by playlist:', error);
    return allVideos.filter(video => video.playlist === playlist);
  }
};

export const createVideo = async (videoData: Omit<Video, 'id'>): Promise<Video> => {
  const token = getAuthToken();
  if (!token) throw new Error('Not authenticated');

  if (!videoData.title) throw new Error('Title is required');
  if (!videoData.description) throw new Error('Description is required');
  if (!videoData.youtubeUrl) throw new Error('YouTube URL is required');
  if (!videoData.category) throw new Error('Category is required');

  const formattedData = {
    ...videoData,
    tags: formatTags(videoData.tags),
    thumbnail: videoData.thumbnail || '',
  };

  try {
    const response = await fetch(`${API_URL}/videos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formattedData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create video');
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating video:', error);
    throw error;
  }
};

export const updateVideo = async (id: string, videoData: Partial<Video>): Promise<Video> => {
  const token = getAuthToken();
  if (!token) throw new Error('Not authenticated');

  try {
    const response = await fetch(`${API_URL}/videos/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(videoData),
    });
    
    if (!response.ok) throw new Error('Failed to update video');
    return await response.json();
  } catch (error) {
    console.error('Error updating video:', error);
    throw error;
  }
};

export const deleteVideo = async (id: string): Promise<void> => {
  const token = getAuthToken();
  if (!token) throw new Error('Not authenticated');

  try {
    const response = await fetch(`${API_URL}/videos/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    if (!response.ok) throw new Error('Failed to delete video');
  } catch (error) {
    console.error('Error deleting video:', error);
    throw error;
  }
};

export const getVideoCategories = async (): Promise<string[]> => {
  try {
    const response = await fetch(`${API_URL}/videos/meta/categories`);
    if (!response.ok) throw new Error('Failed to fetch categories');
    return await response.json();
  } catch (error) {
    console.error('Error fetching categories:', error);
    const categories = Array.from(new Set(allVideos.map(video => video.category)));
    return ['All', ...categories];
  }
};

export const getVideoPlaylists = async (): Promise<string[]> => {
  try {
    const response = await fetch(`${API_URL}/videos/meta/playlists`);
    if (!response.ok) throw new Error('Failed to fetch playlists');
    return await response.json();
  } catch (error) {
    console.error('Error fetching playlists:', error);
    const playlists = Array.from(
      new Set(
        allVideos
          .filter(video => video.playlist)
          .map(video => video.playlist as string)
      )
    );
    return playlists;
  }
};
