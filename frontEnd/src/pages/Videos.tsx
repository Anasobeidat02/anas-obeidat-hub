
import { useState, useEffect } from 'react';
import { Video } from '@/lib/types';
import { getAllVideos, getVideosByCategory } from '@/lib/api';
import VideoCard from '@/components/videos/VideoCard';
import VideoFilter from '@/components/videos/VideoFilter';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Input } from '@/components/ui/input';

const Videos = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [filteredVideos, setFilteredVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  
  // Extract unique categories from videos
  const categories = ['All', ...Array.from(new Set(videos.map(video => video.category)))];

  useEffect(() => {
    const loadVideos = async () => {
      try {
        const data = await getAllVideos();
        setVideos(data);
        setFilteredVideos(data);
      } catch (error) {
        console.error('Error loading videos:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadVideos();
  }, []);

  useEffect(() => {
    const filterVideos = async () => {
      setIsLoading(true);
      try {
        let filtered;
        
        if (activeCategory === 'All') {
          filtered = videos;
        } else {
          filtered = await getVideosByCategory(activeCategory);
        }
        
        // Apply search filter if search query exists
        if (searchQuery) {
          filtered = filtered.filter(video => 
            video.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
            video.description.toLowerCase().includes(searchQuery.toLowerCase())
          );
        }
        
        setFilteredVideos(filtered);
      } catch (error) {
        console.error('Error filtering videos:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    filterVideos();
  }, [activeCategory, searchQuery, videos]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="container-custom">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-display font-bold mb-4">Educational Videos</h1>
            <p className="text-gray-600 max-w-2xl">
              Browse my collection of programming tutorials covering frontend, backend, databases, and more. All content is in Arabic to help Arabic speakers learn programming.
            </p>
          </div>
          
          <div className="mb-8">
            <Input
              placeholder="Search videos..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="max-w-md"
            />
          </div>
          
          <VideoFilter 
            categories={categories} 
            activeCategory={activeCategory} 
            onSelectCategory={handleCategoryChange} 
          />
          
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-video bg-gray-200 rounded-lg mb-3"></div>
                  <div className="h-5 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          ) : filteredVideos.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredVideos.map((video) => (
                <VideoCard key={video.id} video={video} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-xl font-display font-medium mb-2">No videos found</h3>
              <p className="text-gray-600">
                Try changing your search criteria or check back later for new content.
              </p>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Videos;
