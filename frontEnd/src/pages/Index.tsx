
import { useTranslation } from 'react-i18next';
import Hero from '@/components/home/Hero';
import FeaturedVideos from '@/components/home/FeaturedVideos';
import FeaturedProjects from '@/components/home/FeaturedProjects';
import FeaturedMaterials from '@/components/home/FeaturedMaterials';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const Index = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        <Hero />
        <FeaturedVideos />
        <FeaturedProjects />
        <FeaturedMaterials />
        
        <section className="py-20 bg-primary text-white">
          <div className="container-custom text-center">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">{t('home.cta.title')}</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              {t('home.cta.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="https://youtube.com/@anas_obeidat?si=J-RWY9vjBpIxRYGe" target="_blank" rel="noopener noreferrer">
                <Button size="lg" variant="secondary" className="px-6">
                  {t('home.cta.youtube')}
                </Button>
              </a>
              <Link to="/videos">
                <Button size="lg" variant="outline" className="border-white text-secondary-foreground hover:bg-white/20 px-6">
                  {t('home.cta.browseVideos')}
                </Button>
              </Link>
              <Link to="/quiz">
                <Button size="lg" variant="outline" className="border-white text-secondary-foreground hover:bg-white/20 px-6">
                  {t('home.cta.takeQuiz')}
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
