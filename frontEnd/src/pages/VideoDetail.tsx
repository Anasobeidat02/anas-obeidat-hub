
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Video, Comment } from '@/lib/types';
import { getVideoById, getCommentsForVideo, addComment, getVideosByCategory } from '@/lib/api';
import VideoPlayer from '@/components/videos/VideoPlayer';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';

const VideoDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [video, setVideo] = useState<Video | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [relatedVideos, setRelatedVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  useEffect(() => {
    const loadVideo = async () => {
      if (!id) return;
      
      setIsLoading(true);
      try {
        const videoData = await getVideoById(id);
        if (videoData) {
          setVideo(videoData);
          
          // Load comments
          const commentsData = await getCommentsForVideo(id);
          setComments(commentsData);
          
          // Load related videos by category
          if (videoData.category) {
            const related = await getVideosByCategory(videoData.category);
            setRelatedVideos(
              related
                .filter(v => v.id !== id)
                .slice(0, 5)
            );
          }
        }
      } catch (error) {
        console.error('Error loading video:', error);
        toast({
          title: "Error",
          description: "Could not load the video. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadVideo();
  }, [id, toast]);
  
  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!id || !commentText.trim()) return;
    
    setIsSubmitting(true);
    try {
      const newComment = await addComment(id, commentText);
      setComments(prev => [newComment, ...prev]);
      setCommentText('');
      toast({
        title: "Comment added",
        description: "Your comment has been posted successfully.",
      });
    } catch (error) {
      console.error('Error adding comment:', error);
      toast({
        title: "Error",
        description: "Could not add your comment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading || !video) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow pt-24 pb-16">
          <div className="container-custom">
            <div className="animate-pulse">
              <div className="aspect-video bg-gray-200 rounded-lg mb-6"></div>
              <div className="h-8 bg-gray-200 rounded mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main content */}
            <div className="lg:col-span-2">
              <VideoPlayer video={video} />
              
              {/* Comments section */}
              <div className="mt-12">
                <h3 className="text-xl font-display font-semibold mb-6">Comments ({comments.length})</h3>
                
                {/* Add comment form */}
                <form onSubmit={handleCommentSubmit} className="mb-8">
                  <Textarea
                    placeholder="Add a comment..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    rows={3}
                    className="mb-3"
                  />
                  <Button 
                    type="submit" 
                    disabled={isSubmitting || !commentText.trim()}
                  >
                    {isSubmitting ? 'Posting...' : 'Post Comment'}
                  </Button>
                </form>
                
                {/* Comments list */}
                {comments.length > 0 ? (
                  <div className="space-y-6">
                    {comments.map((comment) => (
                      <Card key={comment.id}>
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-full bg-gray-200 flex-shrink-0">
                              {comment.user.name.charAt(0)}
                            </div>
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-semibold">{comment.user.name}</span>
                                <span className="text-xs text-gray-500">
                                  {new Date(comment.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                              <p className="text-gray-700">{comment.content}</p>
                              
                              {/* Replies */}
                              {comment.replies && comment.replies.length > 0 && (
                                <div className="mt-4 pl-4 border-l-2 border-gray-100 space-y-4">
                                  {comment.replies.map((reply) => (
                                    <div key={reply.id} className="flex items-start gap-3">
                                      <div className="w-8 h-8 rounded-full bg-gray-200 flex-shrink-0 text-sm flex items-center justify-center">
                                        {reply.user.name.charAt(0)}
                                      </div>
                                      <div>
                                        <div className="flex items-center gap-2 mb-1">
                                          <span className="font-semibold">{reply.user.name}</span>
                                          <span className="text-xs text-gray-500">
                                            {new Date(reply.createdAt).toLocaleDateString()}
                                          </span>
                                        </div>
                                        <p className="text-gray-700">{reply.content}</p>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-6">
                    No comments yet. Be the first to comment!
                  </p>
                )}
              </div>
            </div>
            
            {/* Sidebar */}
            <div>
              <div className="sticky top-24">
                <h3 className="text-lg font-display font-semibold mb-4">Related Videos</h3>
                <div className="space-y-4">
                  {relatedVideos.length > 0 ? (
                    relatedVideos.map((relatedVideo) => (
                      <Link to={`/videos/${relatedVideo.id}`} key={relatedVideo.id}>
                        <div className="flex gap-3 group">
                          <div className="w-24 h-16 bg-gray-100 flex-shrink-0 rounded overflow-hidden relative">
                            {relatedVideo.thumbnail ? (
                              <img 
                                src={relatedVideo.thumbnail} 
                                alt={relatedVideo.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <span className="text-xs text-gray-500">Thumbnail</span>
                              </div>
                            )}
                          </div>
                          <div>
                            <h4 className="font-medium line-clamp-2 group-hover:text-primary transition-colors">
                              {relatedVideo.title}
                            </h4>
                            <p className="text-xs text-gray-500 mt-1">{relatedVideo.views.toLocaleString()} views</p>
                          </div>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">No related videos found</p>
                  )}
                </div>
                
                {video.playlist && (
                  <div className="mt-8">
                    <h3 className="text-lg font-display font-semibold mb-4">
                      Playlist: {video.playlist}
                    </h3>
                    <Link to={`/playlist/${encodeURIComponent(video.playlist)}`}>
                      <Button variant="outline" className="w-full">
                        View Full Playlist
                      </Button>
                    </Link>
                  </div>
                )}
                
                <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-display font-semibold mb-3">Subscribe for Updates</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Stay updated with my latest videos and tutorials.
                  </p>
                  <a href="https://www.youtube.com/channel/UC5pNwb4QzN_idYDJodRXdXA" target="_blank" rel="noopener noreferrer">
                    <Button className="w-full">Subscribe on YouTube</Button>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default VideoDetail;
