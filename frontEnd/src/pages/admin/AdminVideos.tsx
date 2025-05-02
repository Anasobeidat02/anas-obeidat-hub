
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { Plus, Search, Pencil, Trash2, FileVideo } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Video } from '@/lib/types';
import VideoForm from '@/components/admin/VideoForm';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { createVideo, updateVideo, deleteVideo, getAllVideos, getVideoCategories, getVideoPlaylists } from '@/lib/api';
import { Badge } from '@/components/ui/badge';

const AdminVideos = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [playlistFilter, setPlaylistFilter] = useState('all'); 
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [currentVideo, setCurrentVideo] = useState<Video | null>(null);

  // Fetch videos using React Query
  const { 
    data: videos = [], 
    isLoading: isLoadingVideos 
  } = useQuery({
    queryKey: ['videos'],
    queryFn: getAllVideos,
  });

  // Fetch categories and playlists
  const { data: categories = ['All'] } = useQuery({
    queryKey: ['videoCategories'],
    queryFn: getVideoCategories,
  });

  const { data: playlists = [] } = useQuery({
    queryKey: ['videoPlaylists'],
    queryFn: getVideoPlaylists,
  });

  // Filter playlists to ensure no empty values
  const filteredPlaylists = playlists.filter(playlist => playlist && playlist.trim() !== '');

  // Mutations
  const createMutation = useMutation({
    mutationFn: createVideo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['videos'] });
      setAddDialogOpen(false);
      toast({
        title: "Video added",
        description: "New video has been added successfully",
      });
    },
    onError: (error) => {
      console.error('Error creating video:', error);
      toast({
        title: "Error",
        description: `Failed to add video. ${error.message}.`,
        variant: "destructive"
      });
    }
  });

  // Batch create mutation
  const batchCreateMutation = useMutation({
    mutationFn: async (videos: Video[]) => {
      const results = [];
      for (const video of videos) {
        try {
          const result = await createVideo(video);
          results.push(result);
        } catch (error) {
          console.error('Error creating video:', error);
          throw error;
        }
      }
      return results;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['videos'] });
      setAddDialogOpen(false);
      toast({
        title: "Videos imported",
        description: `${data.length} videos have been imported successfully`,
      });
    },
    onError: (error) => {
      console.error('Error importing videos:', error);
      toast({
        title: "Error",
        description: "Failed to import videos. Please try again.",
        variant: "destructive"
      });
    }
  });

  const updateMutation = useMutation({
    mutationFn: (video: Video) => updateVideo(video.id, video),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['videos'] });
      setEditDialogOpen(false);
      setCurrentVideo(null);
      toast({
        title: "Video updated",
        description: "Video has been updated successfully",
      });
    },
    onError: (error) => {
      console.error('Error updating video:', error);
      toast({
        title: "Error",
        description: "Failed to update video. Please try again.",
        variant: "destructive"
      });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: deleteVideo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['videos'] });
      toast({
        title: "Video deleted",
        description: "Video has been deleted successfully",
      });
    },
    onError: (error) => {
      console.error('Error deleting video:', error);
      toast({
        title: "Error",
        description: "Failed to delete video. Please try again.",
        variant: "destructive"
      });
    }
  });

  const filteredVideos = videos.filter(v => {
    const matchesFilter = 
      v.title.toLowerCase().includes(filter.toLowerCase()) ||
      v.description.toLowerCase().includes(filter.toLowerCase());
    
    const matchesCategory = categoryFilter === 'All' || v.category === categoryFilter;
    
    const matchesPlaylist = playlistFilter === 'all' || v.playlist === playlistFilter;
    
    return matchesFilter && matchesCategory && matchesPlaylist;
  });

  const handleAddVideo = (video: Omit<Video, 'id'>) => {
    createMutation.mutate(video as any);
  };

  const handleAddBatchVideos = (videos: Video[]) => {
    batchCreateMutation.mutate(videos);
  };

  const handleUpdateVideo = (updatedVideo: Video) => {
    updateMutation.mutate(updatedVideo);
  };

  const handleDeleteVideo = (id: string) => {
    if (confirm('Are you sure you want to delete this video?')) {
      deleteMutation.mutate(id);
    }
  };

  const editVideo = (video: Video) => {
    setCurrentVideo(video);
    setEditDialogOpen(true);
  };

  // Filter categories to ensure no empty values
  const validCategories = categories.filter(cat => cat && cat.trim() !== '');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Videos</h1>
          <p className="text-gray-500 mt-1">Manage video tutorials</p>
        </div>
        
        <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <FileVideo className="h-4 w-4 mr-2" />
              Add Video
            </Button>
          </DialogTrigger>
          <DialogContent className="w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6">
            <DialogHeader>
              <DialogTitle>Add New Video</DialogTitle>
            </DialogHeader>
            <VideoForm 
              onSubmit={handleAddVideo}
              onBatchSubmit={handleAddBatchVideos}
            />
          </DialogContent>
        </Dialog>
      </div>
      
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-grow">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search videos..."
                className="pl-8"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Select
                value={categoryFilter}
                onValueChange={setCategoryFilter}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  {validCategories.map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select
                value={playlistFilter}
                onValueChange={setPlaylistFilter}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="All Playlists" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Playlists</SelectItem>
                  {filteredPlaylists.map((playlist) => (
                    <SelectItem key={playlist} value={playlist}>{playlist}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Playlist</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoadingVideos ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      <div className="flex justify-center items-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
                        <span className="ml-2">Loading videos...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredVideos.length > 0 ? (
                  filteredVideos.map((video) => (
                    <TableRow key={video.id}>
                      <TableCell className="font-medium">
                        {video.title}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-blue-50 text-primary border-blue-100">
                          {video.category}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {video.playlist ? (
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-100">
                            {video.playlist}
                          </Badge>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </TableCell>
                      <TableCell>{new Date(video.publishedAt).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => editVideo(video)}
                          >
                            <Pencil className="h-3.5 w-3.5" />
                            <span className="sr-only">Edit</span>
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-red-500 hover:text-red-700"
                            onClick={() => handleDeleteVideo(video.id)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                      No videos found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Edit Video Dialog */}
      {currentVideo && (
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Video</DialogTitle>
            </DialogHeader>
            <VideoForm 
              onSubmit={handleUpdateVideo} 
              initialData={currentVideo} 
              isEditing
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default AdminVideos;
