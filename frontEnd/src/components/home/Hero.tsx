
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Hero = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative bg-gradient-to-b from-white to-gray-50 pt-24 pb-16 md:pt-32 md:pb-24">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className={`${isVisible ? 'opacity-100' : 'opacity-0'} transition-opacity duration-1000`}>
            <span className="inline-block px-3 py-1 text-xs font-semibold bg-blue-100 text-primary rounded-full mb-4">
              Full Stack Developer & Educator
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6 leading-tight">
              Building <span className="text-gradient">Digital</span> Experiences & Sharing Knowledge
            </h1>
            <p className="text-lg text-gray-600 mb-8 max-w-lg">
              مرحبًا! أنا أنس عبيدات، مطور ويب ومعلم متحمس لمشاركة خبراتي في عالم البرمجة وتطوير الويب مع المجتمع العربي.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/videos">
                <Button className="bg-primary hover:bg-primary-700 text-white px-6 py-6 h-auto">
                  Browse Videos
                </Button>
              </Link>
              <Link to="/about">
                <Button variant="outline" className="border-primary text-primary hover:bg-primary/5 px-6 py-6 h-auto">
                  About Me
                </Button>
              </Link>
            </div>
            <div className="mt-8 flex items-center space-x-4">
              <span className="text-sm text-gray-500">Find me on:</span>
              <div className="flex space-x-3">
                <a href="https://github.com/Anasobeidat02" target="_blank" rel="noopener noreferrer" 
                   className="text-gray-500 hover:text-primary transition-colors">
                  GitHub
                </a>
                <a href="https://youtube.com/@anas-obeidat" target="_blank" rel="noopener noreferrer" 
                   className="text-gray-500 hover:text-primary transition-colors">
                  YouTube
                </a>
              </div>
            </div>
          </div>
          
          <div className={`relative ${isVisible ? 'opacity-100' : 'opacity-0'} transition-opacity duration-1000 delay-300`}>
            <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden shadow-xl relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <span className="block text-4xl font-display font-bold mb-3 text-primary">Anas Obeidat</span>
                  <span className="block text-lg text-gray-600">Developer & Educator</span>
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-blue-400/10"></div>
            </div>
            
            <div className="absolute -bottom-8 -right-8 w-40 h-40 bg-blue-100 rounded-full -z-10"></div>
            <div className="absolute -top-8 -left-8 w-24 h-24 bg-gray-200 rounded-full -z-10"></div>
          </div>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="hidden md:block absolute top-1/2 right-0 w-48 h-48 bg-blue-50 rounded-full -translate-y-1/2 translate-x-1/2 -z-10"></div>
    </section>
  );
};

export default Hero;
