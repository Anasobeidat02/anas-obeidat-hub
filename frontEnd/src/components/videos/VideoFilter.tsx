
import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface VideoFilterProps {
  categories: string[];
  activeCategory: string;
  onSelectCategory: (category: string) => void;
}

const VideoFilter = ({ 
  categories, 
  activeCategory, 
  onSelectCategory 
}: VideoFilterProps) => {
  const [showAllCategories, setShowAllCategories] = useState(false);
  
  // Show a limited number of categories initially
  const visibleCategories = showAllCategories 
    ? categories 
    : categories.slice(0, 5);
  
  return (
    <div className="mb-8">
      <div className="mb-2">
        <h3 className="text-sm font-semibold text-gray-500 mb-3">Filter by Category:</h3>
        <div className="flex flex-wrap gap-2">
          {visibleCategories.map((category) => (
            <Button
              key={category}
              variant={activeCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => onSelectCategory(category)}
              className={activeCategory === category ? "bg-primary" : ""}
            >
              {category}
            </Button>
          ))}
          
          {categories.length > 5 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAllCategories(!showAllCategories)}
            >
              {showAllCategories ? "Show Less" : `+${categories.length - 5} More`}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoFilter;
