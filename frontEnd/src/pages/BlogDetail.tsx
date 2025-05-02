
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getBlogBySlug } from '@/lib/api';
import { Blog } from '@/lib/types';
import { useToast } from '@/components/ui/use-toast';
import { ChevronLeft, Calendar, User, Tag } from 'lucide-react';

const BlogDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchBlog = async () => {
      if (!slug) return;
      
      try {
        setLoading(true);
        const data = await getBlogBySlug(slug);
        setBlog(data);
      } catch (error) {
        console.error('Failed to fetch blog:', error);
        toast({
          title: 'Error',
          description: 'Failed to load blog. Please try again later.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [slug, toast]);

  if (loading) {
    return (
      <div className="container mx-auto py-16 px-4">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="container mx-auto py-16 px-4">
        <div className="text-center py-16">
          <h2 className="text-2xl font-bold mb-2">Blog not found</h2>
          <p className="text-gray-600 mb-6">The blog you're looking for doesn't seem to exist.</p>
          <Link 
            to="/blogs" 
            className="inline-flex items-center text-blue-600 hover:text-blue-800"
          >
            <ChevronLeft size={16} className="mr-1" />
            Back to all blogs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="mb-8">
        <Link 
          to="/blogs" 
          className="inline-flex items-center text-blue-600 hover:text-blue-800"
        >
          <ChevronLeft size={16} className="mr-1" />
          Back to all blogs
        </Link>
      </div>
      
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-6">{blog.title}</h1>
          
          <div className="flex flex-wrap items-center text-gray-600 gap-4 mb-6">
            <div className="flex items-center">
              <Calendar size={16} className="mr-1" />
              <span>{new Date(blog.publishedAt).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center">
              <User size={16} className="mr-1" />
              <span>By {blog.author}</span>
            </div>
            <div className="flex items-center">
              <Tag size={16} className="mr-1" />
              <span>{blog.category}</span>
            </div>
          </div>
          
          <div className="mb-8">
            <img 
              src={blog.thumbnail} 
              alt={blog.title}
              className="w-full h-auto rounded-lg shadow-md"
            />
          </div>
        </div>
        
        <div className="prose prose-lg max-w-none">
          {/* This would ideally be rendered from markdown */}
          <div dangerouslySetInnerHTML={{ __html: blog.content.replace(/\n/g, '<br/>') }} />
        </div>
        
        <div className="mt-12 pt-6 border-t border-gray-200">
          <div className="flex flex-wrap gap-2">
            {blog.tags.map(tag => (
              <span 
                key={tag} 
                className="bg-gray-100 text-gray-800 px-3 py-1 text-sm rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogDetail;
