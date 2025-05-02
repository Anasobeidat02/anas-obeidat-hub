import { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Video } from '@/lib/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CardContent, Card } from '@/components/ui/card';
import { AlertCircle, Loader2, Youtube } from 'lucide-react';
import { extractPlaylistId, fetchPlaylistVideos, fetchVideoDetails, YouTubePlaylistItem } from '@/lib/youtubeApi';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';

const videoSchema = z.object({
  title: z.string().min(5, 'Title is required'),
  description: z.string().min(10, 'Description is required'),
  category: z.string().min(1, 'Category is required'),
  youtubeUrl: z.string().url('Must be a valid YouTube URL'),
  thumbnail: z.string().url('Must be a valid URL').optional(),
  playlist: z.string().optional(),
  newCategory: z.string().optional(),
  newPlaylist: z.string().optional(),
  tags: z.string(),
  publishedAt: z.string(),
  duration: z.string(),
  content: z.string().optional(),
});

// Schema for the YouTube playlist form
const playlistSchema = z.object({
  playlistUrl: z.string().url('Must be a valid YouTube URL'),
  youtubeApiKey: z.string().min(1, 'API Key is required'),
  category: z.string().min(1, 'Category is required'),
  playlist: z.string().optional(),
  newCategory: z.string().optional(),
});

type VideoFormData = z.infer<typeof videoSchema>;
type PlaylistFormData = z.infer<typeof playlistSchema>;

interface VideoFormProps {
  onSubmit: (data: Video) => void;
  onBatchSubmit?: (videos: Video[]) => void;
  initialData?: Video;
  isEditing?: boolean;
}

const VideoForm = ({ onSubmit, onBatchSubmit, initialData, isEditing = false }: VideoFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState<string[]>(['React', 'JavaScript', 'Node.js', 'CSS', 'HTML', 'TypeScript', 'Database', 'Security']);
  const [playlists, setPlaylists] = useState<string[]>(['Getting Started', 'Advanced Topics', 'Projects']);
  const [useCustomCategory, setUseCustomCategory] = useState(false);
  const [useCustomPlaylist, setUseCustomPlaylist] = useState(false);
  const [useCustomCategoryForPlaylist, setUseCustomCategoryForPlaylist] = useState(false);
  
  // YouTube playlist import state
  const [playlistVideos, setPlaylistVideos] = useState<YouTubePlaylistItem[]>([]);
  const [selectedVideos, setSelectedVideos] = useState<Set<string>>(new Set());
  const [isLoadingPlaylist, setIsLoadingPlaylist] = useState(false);
  const [playlistError, setPlaylistError] = useState<string | null>(null);

  // Create form for single video
  const form = useForm<VideoFormData>({
    resolver: zodResolver(videoSchema),
    defaultValues: initialData 
      ? {
          title: initialData.title,
          description: initialData.description,
          category: initialData.category,
          youtubeUrl: initialData.youtubeUrl || '',
          thumbnail: initialData.thumbnail,
          playlist: initialData.playlist || '',
          tags: initialData.tags.join(', '),
          publishedAt: initialData.publishedAt.split('T')[0],
          duration: initialData.duration,
          content: initialData.content || '',
          newCategory: '',
          newPlaylist: '',
        }
      : {
          title: '',
          description: '',
          category: '',
          youtubeUrl: '',
          thumbnail: '',
          playlist: '',
          tags: '',
          publishedAt: new Date().toISOString().split('T')[0],
          duration: '',
          content: '',
          newCategory: '',
          newPlaylist: '',
        }
  });
  
  // Create form for YouTube playlist import
  const playlistForm = useForm<PlaylistFormData>({
    resolver: zodResolver(playlistSchema),
    defaultValues: {
      playlistUrl: '',
      youtubeApiKey: '',
      category: '',
      playlist: '',
      newCategory: '',
    }
  });

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        // This would be replaced with actual API calls in production
      } catch (error) {
        console.error('Error fetching metadata:', error);
      }
    };
    fetchMetadata();
  }, []);

  // Watch for changes to detect if we're using new category/playlist
  const watchCategory = form.watch('category');
  const watchPlaylist = form.watch('playlist');
  
  useEffect(() => {
    if (watchCategory === 'add_new') {
      setUseCustomCategory(true);
    } else {
      setUseCustomCategory(false);
    }
  }, [watchCategory]);
  
  useEffect(() => {
    if (watchPlaylist === 'add_new') {
      setUseCustomPlaylist(true);
    } else {
      setUseCustomPlaylist(false);
    }
  }, [watchPlaylist]);

  // Watch for playlist category changes
  useEffect(() => {
    const watchPlaylistCategory = playlistForm.watch('category');
    if (watchPlaylistCategory === 'add_new') {
      setUseCustomCategoryForPlaylist(true);
    } else {
      setUseCustomCategoryForPlaylist(false);
    }
  }, [playlistForm.watch('category')]);

  const generateThumbnail = () => {
    const youtubeUrl = form.getValues('youtubeUrl');
    if (!youtubeUrl) return;
    
    try {
      const url = new URL(youtubeUrl);
      let videoId;
      if (url.hostname.includes('youtube.com')) {
        videoId = url.searchParams.get('v');
      } else if (url.hostname.includes('youtu.be')) {
        videoId = url.pathname.substring(1);
      }
      if (videoId) {
        const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
        form.setValue('thumbnail', thumbnailUrl);
      }
    } catch (error) {
      console.error('Invalid YouTube URL:', error);
    }
  };

  const handleSubmit = (data: VideoFormData) => {
    setIsSubmitting(true);
    try {
      let finalCategory = data.category;
      if (data.category === 'add_new' && data.newCategory) {
        finalCategory = data.newCategory;
        setCategories([...categories, data.newCategory]);
      }
      
      let finalPlaylist = data.playlist;
      if (data.playlist === 'add_new' && data.newPlaylist) {
        finalPlaylist = data.newPlaylist;
        setPlaylists([...playlists, data.newPlaylist]);
      }
      
      const formattedData = {
        id: initialData?.id || '',
        title: data.title,
        description: data.description,
        category: finalCategory,
        youtubeUrl: data.youtubeUrl,
        thumbnail: data.thumbnail || `https://img.youtube.com/vi/${extractYoutubeId(data.youtubeUrl)}/maxresdefault.jpg`,
        playlist: finalPlaylist || null,
        tags: data.tags.split(',').map(tag => tag.trim()).filter(Boolean),
        publishedAt: data.publishedAt,
        duration: data.duration,
        content: data.content || '',
        views: initialData?.views || 0,
      };
      onSubmit(formattedData);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handlePlaylistImport = async (data: PlaylistFormData) => {
    setIsLoadingPlaylist(true);
    setPlaylistError(null);
    setPlaylistVideos([]);
    
    try {
      const playlistId = extractPlaylistId(data.playlistUrl);
      if (!playlistId) {
        setPlaylistError('Invalid YouTube playlist URL');
        setIsLoadingPlaylist(false);
        return;
      }
      
      const playlistData = await fetchPlaylistVideos(playlistId, data.youtubeApiKey);
      if (playlistData.items.length === 0) {
        setPlaylistError('No videos found in this playlist');
        setIsLoadingPlaylist(false);
        return;
      }
      
      const videoIds = playlistData.items.map(item => item.videoId);
      const durationMap = await fetchVideoDetails(videoIds, data.youtubeApiKey);
      
      const videosWithDurations = playlistData.items.map(video => ({
        ...video,
        duration: durationMap.get(video.videoId) || '0:00'
      }));
      
      setPlaylistVideos(videosWithDurations);
      
      const newSelected = new Set<string>();
      videosWithDurations.forEach(video => newSelected.add(video.id));
      setSelectedVideos(newSelected);
      
      // Add new category if provided
      if (data.category === 'add_new' && data.newCategory) {
        setCategories([...categories, data.newCategory]);
      }
    } catch (error) {
      console.error('Error importing playlist:', error);
      setPlaylistError(error instanceof Error ? error.message : 'Failed to import playlist');
    } finally {
      setIsLoadingPlaylist(false);
    }
  };
  
  const toggleVideoSelection = (videoId: string) => {
    const newSelected = new Set(selectedVideos);
    if (newSelected.has(videoId)) {
      newSelected.delete(videoId);
    } else {
      newSelected.add(videoId);
    }
    setSelectedVideos(newSelected);
  };
  
  const toggleAllVideos = () => {
    if (selectedVideos.size === playlistVideos.length) {
      setSelectedVideos(new Set());
    } else {
      const newSelected = new Set<string>();
      playlistVideos.forEach(video => newSelected.add(video.id));
      setSelectedVideos(newSelected);
    }
  };
  
  const importSelectedVideos = () => {
    if (selectedVideos.size === 0) {
      setPlaylistError('Please select at least one video to import');
      return;
    }
    
    setIsSubmitting(true);
    try {
      const playlistCategory = playlistForm.getValues('category') === 'add_new' 
        ? playlistForm.getValues('newCategory') 
        : playlistForm.getValues('category');
      const playlistName = playlistForm.getValues('playlist');
      
      const videosToImport = playlistVideos
        .filter(video => selectedVideos.has(video.id))
        .map(video => ({
          id: '',
          title: video.title,
          description: video.description,
          category: playlistCategory,
          youtubeUrl: `https://www.youtube.com/watch?v=${video.videoId}`,
          thumbnail: video.thumbnail,
          playlist: playlistName || null,
          tags: [],
          publishedAt: video.publishedAt,
          duration: video.duration,
          content: '',
          views: 0,
        }));
      
      if (onBatchSubmit) {
        onBatchSubmit(videosToImport);
      }
    } catch (error) {
      console.error('Error importing videos:', error);
      setPlaylistError(error instanceof Error ? error.message : 'Failed to import videos');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const extractYoutubeId = (url: string): string => {
    try {
      const parsedUrl = new URL(url);
      if (parsedUrl.hostname.includes('youtube.com')) {
        return parsedUrl.searchParams.get('v') || '';
      } else if (parsedUrl.hostname.includes('youtu.be')) {
        return parsedUrl.pathname.substring(1);
      }
      return '';
    } catch {
      return '';
    }
  };
  
  const validCategories = categories.filter(cat => cat && cat.trim() !== '');
  const validPlaylists = playlists.filter(playlist => playlist && playlist.trim() !== '');

  return (
    <Tabs defaultValue="single">
      <TabsList className="grid grid-cols-2 mb-6">
        <TabsTrigger value="single">Single Video</TabsTrigger>
        <TabsTrigger value="playlist">Import Playlist</TabsTrigger>
      </TabsList>
      
      <TabsContent value="single">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Video Title</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter the video title..." 
                      {...field} 
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter the video description..." 
                      className="resize-none h-24" 
                      {...field} 
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="youtubeUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>YouTube URL</FormLabel>
                  <div className="flex gap-2">
                    <FormControl className="flex-grow">
                      <Input 
                        placeholder="https://www.youtube.com/watch?v=..." 
                        {...field} 
                        disabled={isSubmitting}
                        onChange={(e) => {
                          field.onChange(e);
                          if (!isEditing || !initialData?.thumbnail) {
                            setTimeout(generateThumbnail, 1000);
                          }
                        }}
                      />
                    </FormControl>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={generateThumbnail}
                      disabled={isSubmitting}
                    >
                      Generate Thumbnail
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select
                        disabled={isSubmitting}
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {validCategories.map((category) => (
                            <SelectItem key={category} value={category}>{category}</SelectItem>
                          ))}
                          <SelectItem value="add_new">+ Add New Category</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {useCustomCategory && (
                  <FormField
                    control={form.control}
                    name="newCategory"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>New Category Name</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Enter new category name..." 
                            {...field} 
                            disabled={isSubmitting}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="playlist"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Playlist (Optional)</FormLabel>
                      <Select
                        disabled={isSubmitting}
                        onValueChange={field.onChange}
                        value={field.value || ""}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select playlist" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="">None</SelectItem>
                          {validPlaylists.map((playlist) => (
                            <SelectItem key={playlist} value={playlist}>{playlist}</SelectItem>
                          ))}
                          <SelectItem value="add_new">+ Add New Playlist</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {useCustomPlaylist && (
                  <FormField
                    control={form.control}
                    name="newPlaylist"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>New Playlist Name</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Enter new playlist name..." 
                            {...field} 
                            disabled={isSubmitting}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="thumbnail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Thumbnail URL</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="https://example.com/image.jpg" 
                        {...field} 
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration (MM:SS)</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="10:30" 
                        {...field} 
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="publishedAt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Publication Date</FormLabel>
                  <FormControl>
                    <Input 
                      type="date" 
                      {...field} 
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags (comma separated)</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="React, Hooks, Tutorial" 
                      {...field} 
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Content</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter code snippets, resources, or any additional content to accompany the video..." 
                      className="resize-none h-32" 
                      {...field} 
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-4 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => isEditing ? onSubmit(initialData!) : form.reset()}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {isEditing ? 'Updating...' : 'Saving...'}
                  </span>
                ) : (
                  <>{isEditing ? 'Update' : 'Save'} Video</>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </TabsContent>
      
      <TabsContent value="playlist">
        <Form {...playlistForm}>
          <form onSubmit={playlistForm.handleSubmit(handlePlaylistImport)} className="space-y-6">
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-md mb-4">
              <p className="text-amber-800 text-sm">
                <AlertCircle className="h-4 w-4 inline-block mr-2" />
                You'll need a valid YouTube API key to import videos from a playlist. The videos will be imported with basic metadata like title, description, and thumbnail.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={playlistForm.control}
                name="playlistUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>YouTube Playlist URL</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="https://www.youtube.com/playlist?list=..." 
                        {...field} 
                        disabled={isLoadingPlaylist}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={playlistForm.control}
                name="youtubeApiKey"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>YouTube API Key</FormLabel>
                    <FormControl>
                      <Input 
                        type="password"
                        placeholder="Enter your YouTube API key" 
                        {...field} 
                        disabled={isLoadingPlaylist}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <FormField
                  control={playlistForm.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Assign Category</FormLabel>
                      <Select
                        disabled={isLoadingPlaylist}
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {validCategories.map((category) => (
                            <SelectItem key={category} value={category}>{category}</SelectItem>
                          ))}
                          <SelectItem value="add_new">+ Add New Category</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {useCustomCategoryForPlaylist && (
                  <FormField
                    control={playlistForm.control}
                    name="newCategory"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>New Category Name</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Enter new category name..." 
                            {...field} 
                            disabled={isLoadingPlaylist}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>
              <FormField
                control={playlistForm.control}
                name="playlist"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Assign Playlist (Optional)</FormLabel>
                    <Select
                      disabled={isLoadingPlaylist}
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select playlist" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="">None</SelectItem>
                        {validPlaylists.map((playlist) => (
                          <SelectItem key={playlist} value={playlist}>{playlist}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <Button 
              type="submit" 
              disabled={isLoadingPlaylist}
              className="w-full"
            >
              {isLoadingPlaylist ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Fetching playlist...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Youtube className="h-4 w-4" />
                  Fetch Playlist Videos
                </span>
              )}
            </Button>
          </form>
        </Form>
        
        {playlistError && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-800 text-sm">{playlistError}</p>
          </div>
        )}
        
        {playlistVideos.length > 0 && (
          <div className="mt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Playlist Videos ({playlistVideos.length})</h3>
              <div className="flex gap-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={toggleAllVideos}
                >
                  {selectedVideos.size === playlistVideos.length ? 'Deselect All' : 'Select All'}
                </Button>
                <Button
                  type="button"
                  size="sm"
                  onClick={importSelectedVideos}
                  disabled={selectedVideos.size === 0 || isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Importing...
                    </span>
                  ) : (
                    <span>Import Selected ({selectedVideos.size})</span>
                  )}
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {playlistVideos.map((video) => (
                <Card key={video.id} className={`overflow-hidden ${selectedVideos.has(video.id) ? 'ring-2 ring-primary' : ''}`}>
                  <div className="relative">
                    <img 
                      src={video.thumbnail} 
                      alt={video.title}
                      className="w-full aspect-video object-cover"
                    />
                    <Badge className="absolute bottom-2 right-2 bg-black/70">{video.duration}</Badge>
                    <div className="absolute top-2 right-2">
                      <Checkbox 
                        checked={selectedVideos.has(video.id)}
                        onCheckedChange={() => toggleVideoSelection(video.id)}
                      />
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h4 className="font-medium line-clamp-2">{video.title}</h4>
                    <p className="text-sm text-gray-500 mt-1">
                      {new Date(video.publishedAt).toLocaleDateString()}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
};

export default VideoForm;