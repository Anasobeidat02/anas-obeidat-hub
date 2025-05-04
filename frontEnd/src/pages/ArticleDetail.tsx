import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getArticleBySlug } from '@/lib/api/articles';
import { useToast } from '@/components/ui/use-toast';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ExternalLink, Copy } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';

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

  // Color gradient map similar to ProgrammingLanguages.tsx
  const getGradient = (color: string) => {
    const gradients: { [key: string]: string } = {
      blue: 'bg-gradient-to-br from-blue-500 to-purple-600',
      red: 'bg-gradient-to-br from-red-500 to-orange-600',
      green: 'bg-gradient-to-br from-green-500 to-teal-600',
      yellow: 'bg-gradient-to-br from-yellow-500 to-amber-600',
      purple: 'bg-gradient-to-br from-purple-500 to-indigo-600',
      pink: 'bg-gradient-to-br from-pink-500 to-rose-600',
      teal: 'bg-gradient-to-br from-teal-500 to-cyan-600',
      orange: 'bg-gradient-to-br from-orange-500 to-amber-600',
      indigo: 'bg-gradient-to-br from-indigo-500 to-blue-600',
      cyan: 'bg-gradient-to-br from-cyan-500 to-sky-600',
      silver: 'bg-gradient-to-br from-gray-400 to-gray-600',
      black: 'bg-gradient-to-br from-gray-700 to-gray-900',
    };
    return gradients[color.toLowerCase()] || 'bg-gradient-to-br from-slate-500 to-gray-600';
  };

  // Function to copy code to clipboard
  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code).then(() => {
      toast({
        title: 'Copied!',
        description: 'Code copied to clipboard.',
        variant: 'default',
      });
    }).catch(() => {
      toast({
        title: 'Error',
        description: 'Failed to copy code.',
        variant: 'destructive',
      });
    });
  };

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        if (slug) {
          const data = await getArticleBySlug(slug);
          console.log('Article data:', data); // Debug: Log article data
          console.log('Article color:', data.color); // Debug: Log color
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

  // Normalize color and get gradient
  const normalizedColor = article.color ? article.color.toLowerCase() : 'default';
  const gradientClass = getGradient(normalizedColor);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        {/* Article Header */}
        <div className={`${gradientClass} py-12 !bg-gradient-to-br`}>
          <div className="container mx-auto px-4">
            <Link to="/programming-languages" className="inline-flex items-center text-white hover:underline mb-6">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Programming Languages
            </Link>
            
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              {article.icon && (
                <div className="w-20 h-20 flex items-center justify-center rounded-lg bg-white shadow-md">
                  <img src={article.icon} alt={article.title} className="w-12 h-12 object-contain" />
                </div>
              )}
              <div>
                <h1 className="text-4xl font-bold mb-2 text-white">{article.title}</h1>
                <p className="text-lg text-gray-200">{article.description}</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Article Content */}
        <div className="container mx-auto px-4 py-12">
          <div className="prose prose-lg max-w-none">
            <ReactMarkdown
              components={{
                code({ node, inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || '');
                  const codeContent = String(children).replace(/\n$/, '');
                  return !inline && match ? (
                    <div className="relative group">
                      <SyntaxHighlighter
                        style={dracula}
                        language={match[1]}
                        PreTag="div"
                        {...props}
                      >
                        {codeContent}
                      </SyntaxHighlighter>
                      <button
                        onClick={() => copyToClipboard(codeContent)}
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-800 text-white p-2 rounded-md hover:bg-gray-700"
                        title="Copy code"
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  );
                },
              }}
            >
              {article.content}
            </ReactMarkdown>
            
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