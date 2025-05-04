import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Video } from "@/lib/types";
import { Link } from "react-router-dom";
import { useState } from "react";

interface VideoCardProps {
  video: Video;
}

const VideoCard = ({ video }: VideoCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleDescription = () => {
    setIsExpanded(!isExpanded);
  };
  return (
    <Link to={`/videos/${video.id}`}>
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
          <p dir="rtl"
            className={`text-sm text-gray-500 ${
              isExpanded ? "" : "line-clamp-5"
            } cursor-pointer` }
            onClick={toggleDescription}
          >
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
  );
};

export default VideoCard;
