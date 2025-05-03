
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getArticleBySlug } from '@/lib/api/articles';
import { useToast } from '@/components/ui/use-toast';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ExternalLink } from 'lucide-react';

interface Article {
  id: string;
  title: string;
  description: string;
  content: string;
  requirements: string[];
  useCases: string[];
  libraries: Array<{
    name: string;
    description: string;
    url: string;
  }>;
  language: string;
  icon: string;
  color: string;
  createdAt: string;
  updatedAt: string;
}

const ArticleDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        if (slug) {
          const data = await getArticleBySlug(slug);
          setArticle(data);
        }
      } catch (error) {
        console.error('Error fetching article:', error);
        toast({
          title: 'Error',
          description: 'Failed to load the article. Please try again later.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [slug, toast]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="animate-spin w-10 h-10 border-4 border-primary rounded-full border-t-transparent"></div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-12">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Article Not Found</h1>
            <p className="mb-6">The article you're looking for doesn't exist or has been removed.</p>
            <Link to="/programming-languages">
              <Button>
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Programming Languages
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        {/* Article Header */}
        <div className={`bg-${article.color}-100 py-12`}>
          <div className="container mx-auto px-4">
            <Link to="/programming-languages" className="inline-flex items-center text-primary hover:underline mb-6">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Programming Languages
            </Link>
            
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              {article.icon && (
                <div className="w-20 h-20 flex items-center justify-center rounded-lg bg-white shadow-md">
                  <img src={article.icon} alt={article.title} className="w-12 h-12 object-contain" />
                </div>
              )}
              <div>
                <h1 className="text-4xl font-bold mb-2">{article.title}</h1>
                <p className="text-lg text-gray-600">{article.description}</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Article Content */}
        <div className="container mx-auto px-4 py-12">
          <div className="prose prose-lg max-w-none">
            <div className="mb-16" dangerouslySetInnerHTML={{ __html: article.content.replace(/\n/g, '<br />') }} />
            
            {/* Requirements Section */}
            {article.requirements && article.requirements.length > 0 && (
              <div className="mb-12">
                <h2 className="text-2xl font-bold mb-6">Learning Requirements</h2>
                <ul className="space-y-2">
                  {article.requirements.map((req, index) => (
                    <li key={index} className="flex items-start">
                      <span className="inline-block w-6 h-6 rounded-full bg-green-100 text-green-800 flex items-center justify-center mr-3 mt-0.5">✓</span>
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {/* Use Cases Section */}
            {article.useCases && article.useCases.length > 0 && (
              <div className="mb-12">
                <h2 className="text-2xl font-bold mb-6">Common Use Cases</h2>
                <ul className="space-y-2">
                  {article.useCases.map((useCase, index) => (
                    <li key={index} className="flex items-start">
                      <span className="inline-block w-6 h-6 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center mr-3 mt-0.5">•</span>
                      <span>{useCase}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {/* Libraries Section */}
            {article.libraries && article.libraries.length > 0 && (
              <div className="mb-12">
                <h2 className="text-2xl font-bold mb-6">Popular Libraries & Frameworks</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {article.libraries.map((lib, index) => (
                    <div key={index} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                      <h3 className="text-xl font-bold mb-2">{lib.name}</h3>
                      <p className="text-gray-600 mb-4">{lib.description}</p>
                      {lib.url && (
                        <a
                          href={lib.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-primary hover:underline"
                        >
                          Official Website <ExternalLink className="ml-1 h-4 w-4" />
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ArticleDetail;
