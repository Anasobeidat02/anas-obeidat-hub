import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Video } from "@/lib/types";
import { getFeaturedVideos } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

const FeaturedVideos = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadVideos = async () => {
      try {
        const data = await getFeaturedVideos();
        setVideos(data);
      } catch (error) {
        console.error("Error loading featured videos:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadVideos();
  }, []);

  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10">
          <div>
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Featured Videos
            </h2>
            <p className="text-gray-600 max-w-2xl">
              Explore my latest educational content covering everything from
              React hooks to Node.js APIs and database management.
            </p>
          </div>
          <Link to="/videos" className="mt-4 md:mt-0">
            <Button
              variant="outline"
              className="border-primary text-primary hover:bg-primary/5"
            >
              View All Videos
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <div className="aspect-video bg-gray-200"></div>
                <CardContent className="p-4">
                  <div className="h-6 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {videos.map((video) => (
              <Link to={`/videos/${video.id}`} key={video.id}>
                <Card className="overflow-hidden card-hover h-full flex flex-col">
                  <div className="aspect-video bg-gray-100 relative">
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full h-full object-cover absolute inset-0"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-primary/80 flex items-center justify-center">
                        <svg
                          className="w-5 h-5 text-white"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    </div>
                    <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                      {video.duration}
                    </div>
                  </div>
                  <CardContent className="p-4 flex-grow">
                    <h3 className="font-display font-semibold mb-2 line-clamp-2">
                      {video.title}
                    </h3>
                    <p className="text-sm text-gray-500 line-clamp-2">
                      {video.description}
                    </p>
                  </CardContent>
                  <CardFooter className="px-4 pb-4 pt-0 flex justify-between items-center text-xs text-gray-500">
                    <span>
                      {new Date(video.publishedAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                    <span>{video.views.toLocaleString()} views</span>
                  </CardFooter>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedVideos;
