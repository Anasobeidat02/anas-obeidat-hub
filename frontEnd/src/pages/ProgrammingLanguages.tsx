
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllArticles } from '@/lib/api';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

interface Article {
  id: string;
  title: string;
  slug: string;
  description: string;
  icon: string;
  color: string;
  language: string;
  createdAt: string;
  updatedAt: string;
}

const ProgrammingLanguages = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const data = await getAllArticles();
        setArticles(data);
      } catch (error) {
        console.error('Failed to fetch articles:', error);
        toast({
          title: 'Error',
          description: 'Failed to load programming languages. Please try again later.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [toast]);

  const getRandomGradient = (color: string) => {
    const gradients = {
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
    };

    return gradients[color as keyof typeof gradients] || 'bg-gradient-to-br from-slate-500 to-gray-600';
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-16">
          <h1 className="text-4xl font-bold mb-8">Programming Languages</h1>
          
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <Card key={i} className="h-64 animate-pulse bg-gray-100">
                  <CardContent className="p-0 h-full">
                    <div className="h-full flex flex-col">
                      <div className="h-1/2 bg-gray-200"></div>
                      <div className="p-4 space-y-2">
                        <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-200 rounded w-full"></div>
                        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : articles.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-xl text-gray-500">No programming languages found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {articles.map((article) => (
                <Link 
                  key={article.id} 
                  to={`/articles/${article.slug}`} 
                  className="block transform transition-transform hover:scale-105"
                >
                  <Card className="overflow-hidden h-64 shadow-md hover:shadow-xl">
                    <CardContent className="p-0 h-full">
                      <div className="h-full flex flex-col">
                        <div className={`${getRandomGradient(article.color)} h-1/2 flex items-center justify-center p-4`}>
                          <div className="w-20 h-20 text-white flex items-center justify-center">
                            {article.icon ? (
                              <img 
                                src={article.icon} 
                                alt={`${article.title} icon`}
                                className="w-full h-full object-contain"
                              />
                            ) : (
                              <span className="text-4xl font-bold">{article.title.charAt(0)}</span>
                            )}
                          </div>
                        </div>
                        <div className="p-4">
                          <h2 className="text-xl font-bold mb-2">{article.title}</h2>
                          <p className="text-sm text-gray-600 line-clamp-3">{article.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ProgrammingLanguages;
