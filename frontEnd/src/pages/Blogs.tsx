
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllBlogs } from '@/lib/api';
import { Blog } from '@/lib/types';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

const Blogs = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const data = await getAllBlogs();
        setBlogs(data);
      } catch (error) {
        console.error('Failed to fetch blogs:', error);
        toast({
          title: 'Error',
          description: 'Failed to load blogs. Please try again later.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [toast]);

  const filteredBlogs = blogs.filter(
    blog => 
      blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="container mx-auto py-16 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-2">Programming Blogs</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Explore our collection of programming articles covering various languages,
          frameworks, and development topics.
        </p>
      </div>

      <div className="max-w-md mx-auto mb-12">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Search blogs by title, category or tags..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-900"></div>
        </div>
      ) : filteredBlogs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredBlogs.map((blog) => (
            <Link to={`/blogs/${blog.slug}`} key={blog.id}>
              <Card className="h-full overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-video overflow-hidden">
                  <img 
                    src={blog.thumbnail} 
                    alt={blog.title}
                    className="w-full h-full object-cover transition-transform hover:scale-105"
                  />
                </div>
                <CardHeader>
                  <div className="flex items-center mb-2">
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-100">
                      {blog.category}
                    </Badge>
                    <span className="ml-auto text-sm text-gray-500">
                      {new Date(blog.publishedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <CardTitle className="line-clamp-2">{blog.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 line-clamp-3">{blog.excerpt}</p>
                </CardContent>
                <CardFooter>
                  <div className="flex items-center text-sm text-gray-500">
                    <span>By {blog.author}</span>
                  </div>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <h3 className="text-xl font-medium">No blogs found</h3>
          <p className="text-gray-500 mt-2">
            Try adjusting your search or check back later for new content.
          </p>
        </div>
      )}
    </div>
  );
};

export default Blogs;
