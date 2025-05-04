import { useState, useEffect } from "react";
import { Video } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // استيراد أنماط react-toastify
import { FaCopy } from "react-icons/fa"; // استيراد أيقونة النسخ من react-icons


interface VideoPlayerProps {
  video: Video;
}

const VideoPlayer = ({ video }: VideoPlayerProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [videoId, setVideoId] = useState<string | null>(null);

  const [isExpanded, setIsExpanded] = useState(false);

  const toggleDescription = () => {
    setIsExpanded(!isExpanded);
  };

  useEffect(() => {
    // Extract YouTube video ID from URL
    if (video.youtubeUrl) {
      try {
        const url = new URL(video.youtubeUrl);
        let id;

        if (url.hostname.includes("youtube.com")) {
          id = url.searchParams.get("v");
        } else if (url.hostname.includes("youtu.be")) {
          id = url.pathname.substring(1);
        }

        setVideoId(id);
      } catch (error) {
        console.error("Error parsing YouTube URL:", error);
      }
    }

    // Simulate loading the video
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [video.id, video.youtubeUrl]);


  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(video.content);
      toast.success("Text copied to clipboard!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      });
    } catch (error) {
      toast.error("Failed to copy text!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : videoId ? (
          <iframe
            src={`https://www.youtube.com/embed/${videoId}`}
            title={video.title}
            className="absolute inset-0 w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <span className="block text-lg font-semibold mb-2">
                Video Player Placeholder
              </span>
              <span className="block text-sm text-gray-500">
                No valid YouTube URL found
              </span>
            </div>
          </div>
        )}
      </div>

      <div>
        <h1 className="text-2xl md:text-3xl font-display font-bold mb-2">
          {video.title}
        </h1>

        <div className="flex flex-wrap justify-between items-center text-sm text-gray-500 mb-4">
          <div className="flex items-center">
            <span>
              {new Date(video.publishedAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
            <span className="mx-2">•</span>
            <span>{video.views.toLocaleString()} views</span>
          </div>

          <div className="flex gap-2">
            <Badge
              variant="outline"
              className="bg-blue-50 text-primary border-blue-100"
            >
              {video.category}
            </Badge>

            {video.playlist && (
              <Badge
                variant="outline"
                className="bg-green-50 text-green-700 border-green-100"
              >
                {video.playlist}
              </Badge>
            )}
          </div>
        </div>

        <div className="prose max-w-none" dir="rtl">
          <p
            className={`text-sm "text-gray-600" ${
              isExpanded ? "" : "line-clamp-5"
            } cursor-pointer`}
            onClick={toggleDescription}
          >
            {video.description}
          </p>
        </div>

        <div className="flex flex-wrap gap-2 mt-4">
          {video.tags.map((tag, index) => (
            <Badge key={index} variant="secondary" className="bg-gray-100">
              {tag}
            </Badge>
          ))}
        </div>
      </div>

      {/* Additional Content Section */}
      {video.content && (
        <Card className="mt-8">
          <CardContent className="pt-6">
            <h2 className="text-xl font-display font-semibold mb-4">
              Additional Resources
            </h2>
            <div className="prose max-w-none">
              <div className="flex items-center gap-2 mb-2">
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  <FaCopy className="w-5 h-5" />
                  Copy Text
                </button>
              </div>
              <pre className="bg-gray-50 p-4 rounded-md overflow-auto">
                {video.content}
              </pre>
            </div>
          </CardContent>
        </Card>
      )}
       <ToastContainer />
    </div>
  );
};

export default VideoPlayer;
