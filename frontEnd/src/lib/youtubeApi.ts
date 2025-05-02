export interface YouTubePlaylistItem {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  videoId: string;
  publishedAt: string;
  duration?: string; // Adding duration as an optional property
}

export interface YouTubePlaylistResponse {
  items: YouTubePlaylistItem[];
  nextPageToken?: string;
  totalResults: number;
}

/**
 * Extracts the playlist ID from a YouTube playlist URL
 */
export const extractPlaylistId = (url: string): string | null => {
  try {
    const parsedUrl = new URL(url);
    
    // Handle standard YouTube playlist URL format
    if (parsedUrl.searchParams.has('list')) {
      return parsedUrl.searchParams.get('list');
    }
    
    // Handle youtu.be shortened URLs
    if (parsedUrl.hostname === 'youtu.be' && parsedUrl.pathname.length > 1) {
      return parsedUrl.pathname.substring(1);
    }
    
    return null;
  } catch (error) {
    console.error('Error extracting playlist ID:', error);
    return null;
  }
};

/**
 * Fetches videos from a YouTube playlist
 */
export const fetchPlaylistVideos = async (
  playlistId: string,
  apiKey: string,
  maxResults = 50,
  pageToken?: string
): Promise<YouTubePlaylistResponse> => {
  try {
    let url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${playlistId}&maxResults=${maxResults}&key=${apiKey}`;
    
    if (pageToken) {
      url += `&pageToken=${pageToken}`;
    }
    
    const response = await fetch(url);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Failed to fetch playlist videos');
    }
    
    const data = await response.json();
    
    // Map response to simplified format
    const items: YouTubePlaylistItem[] = data.items.map((item: any) => ({
      id: item.id,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnail: 
        item.snippet.thumbnails.maxres?.url ||
        item.snippet.thumbnails.high?.url ||
        item.snippet.thumbnails.medium?.url ||
        item.snippet.thumbnails.default?.url,
      videoId: item.snippet.resourceId.videoId,
      publishedAt: item.snippet.publishedAt
    }));
    
    return {
      items,
      nextPageToken: data.nextPageToken,
      totalResults: data.pageInfo.totalResults
    };
  } catch (error) {
    console.error('Error fetching playlist videos:', error);
    throw error;
  }
};

/**
 * Extracts video duration from YouTube video details
 */
export const fetchVideoDetails = async (
  videoIds: string[],
  apiKey: string
): Promise<Map<string, string>> => {
  try {
    // Batch video IDs (max 50 per request)
    const batchedIds = videoIds.join(',');
    
    const url = `https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${batchedIds}&key=${apiKey}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Failed to fetch video details');
    }
    
    const data = await response.json();
    
    // Map video IDs to durations
    const durationMap = new Map<string, string>();
    data.items.forEach((item: any) => {
      // Convert ISO 8601 duration to MM:SS format
      const isoDuration = item.contentDetails.duration;
      const duration = formatDuration(isoDuration);
      durationMap.set(item.id, duration);
    });
    
    return durationMap;
  } catch (error) {
    console.error('Error fetching video details:', error);
    throw error;
  }
};

/**
 * Converts ISO 8601 duration to MM:SS format
 */
const formatDuration = (isoDuration: string): string => {
  // Remove PT from the start
  const duration = isoDuration.substring(2);
  
  let minutes = 0;
  let seconds = 0;
  
  // Extract hours, minutes, seconds
  const hoursMatch = duration.match(/(\d+)H/);
  const minutesMatch = duration.match(/(\d+)M/);
  const secondsMatch = duration.match(/(\d+)S/);
  
  if (hoursMatch) minutes += parseInt(hoursMatch[1]) * 60;
  if (minutesMatch) minutes += parseInt(minutesMatch[1]);
  if (secondsMatch) seconds = parseInt(secondsMatch[1]);
  
  // Format as MM:SS
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};
