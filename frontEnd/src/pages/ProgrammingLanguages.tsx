
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ProgrammingLanguage } from '@/lib/types';
import { getAllLanguages } from '@/lib/api';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';

const ProgrammingLanguages = () => {
  const [languages, setLanguages] = useState<ProgrammingLanguage[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const data = await getAllLanguages();
        setLanguages(data);
      } catch (error) {
        console.error('Failed to fetch languages:', error);
        toast({
          title: 'Error',
          description: 'Failed to load programming languages. Please try again later.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchLanguages();
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

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-8">Programming Languages</h1>
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
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold mb-8">Programming Languages</h1>
      
      {languages.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-xl text-gray-500">No programming languages found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {languages.map((language) => (
            <Link 
              key={language.id} 
              to={`/languages/${language.slug}`} 
              className="block transform transition-transform hover:scale-105"
            >
              <Card className="overflow-hidden h-64 shadow-md hover:shadow-xl">
                <CardContent className="p-0 h-full">
                  <div className="h-full flex flex-col">
                    <div className={`${getRandomGradient(language.color)} h-1/2 flex items-center justify-center p-4`}>
                      <div className="w-20 h-20 text-white flex items-center justify-center">
                        {language.icon ? (
                          <img 
                            src={language.icon} 
                            alt={`${language.name} icon`}
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <span className="text-4xl font-bold">{language.name.charAt(0)}</span>
                        )}
                      </div>
                    </div>
                    <div className="p-4">
                      <h2 className="text-xl font-bold mb-2">{language.name}</h2>
                      <p className="text-sm text-gray-600 line-clamp-3">{language.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProgrammingLanguages;
