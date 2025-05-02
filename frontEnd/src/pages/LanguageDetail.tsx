
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ProgrammingLanguage } from '@/lib/types';
import { getLanguageBySlug } from '@/lib/api';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { ArrowLeft, BookOpen, Code, Database, Globe, Server, Clock } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const LanguageDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const [language, setLanguage] = useState<ProgrammingLanguage | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchLanguage = async () => {
      if (!slug) return;
      
      try {
        setLoading(true);
        const data = await getLanguageBySlug(slug);
        setLanguage(data);
      } catch (error) {
        console.error(`Failed to fetch language with slug ${slug}:`, error);
        toast({
          title: "Error",
          description: "Failed to load programming language details. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchLanguage();
  }, [slug, toast]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
          <div className="space-y-4">
            <div className="h-6 bg-gray-200 rounded w-1/4"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!language) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">Programming Language Not Found</h1>
        <p className="mb-8">The language you're looking for doesn't exist or has been removed.</p>
        <Link to="/languages">
          <Button>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Languages
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <Link to="/languages" className="inline-flex items-center text-primary hover:underline mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to All Languages
        </Link>
        <h1 className="text-4xl font-bold">{language.name}</h1>
        <p className="text-lg text-gray-600 mt-2">{language.description}</p>
      </div>

      <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl p-8 shadow-lg mb-10">
        <div className="flex justify-center mb-6">
          {language.icon ? (
            <img 
              src={language.icon} 
              alt={`${language.name} icon`}
              className="w-24 h-24 object-contain"
            />
          ) : (
            <div className={`w-24 h-24 rounded-full bg-${language.color}-500 flex items-center justify-center`}>
              <span className="text-3xl font-bold text-white">{language.name.charAt(0)}</span>
            </div>
          )}
        </div>
        
        <div className="prose max-w-none mb-8" dangerouslySetInnerHTML={{ __html: language.content }} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center mb-4">
              <BookOpen className="h-6 w-6 text-primary mr-2" />
              <h2 className="text-2xl font-bold">Learning Requirements</h2>
            </div>
            <Separator className="mb-4" />
            <ul className="space-y-3">
              {language.requirements.map((req, index) => (
                <li key={index} className="flex items-start">
                  <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-primary/10 text-primary text-sm mr-3 flex-shrink-0 mt-0.5">
                    {index + 1}
                  </span>
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center mb-4">
              <Code className="h-6 w-6 text-primary mr-2" />
              <h2 className="text-2xl font-bold">Common Use Cases</h2>
            </div>
            <Separator className="mb-4" />
            <ul className="space-y-3">
              {language.useCases.map((useCase, index) => (
                <li key={index} className="flex items-start">
                  <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-primary/10 text-primary text-sm mr-3 flex-shrink-0 mt-0.5">
                    {index + 1}
                  </span>
                  <span>{useCase}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <h2 className="text-2xl font-bold mb-6">Popular Libraries & Frameworks</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-10">
        {language.libraries.map((library, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <h3 className="font-bold text-lg mb-2">{library.name}</h3>
              <p className="text-sm text-gray-600 mb-4">{library.description}</p>
              <a 
                href={library.url} 
                target="_blank" 
                rel="noreferrer"
                className="text-primary hover:underline text-sm inline-flex items-center"
              >
                <Globe className="h-4 w-4 mr-1" />
                Visit Website
              </a>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-sm text-gray-500 flex items-center">
        <Clock className="h-4 w-4 mr-1" />
        Last updated: {new Date(language.updatedAt).toLocaleDateString()}
      </div>
    </div>
  );
};

export default LanguageDetail;
