
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import BioSection from '@/components/about/BioSection';
import SkillsSection from '@/components/about/SkillsSection';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24">
        {/* Hero section */}
        <section className="bg-gradient-to-b from-gray-50 to-white py-12 mb-8">
          <div className="container-custom">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-display font-bold mb-6">
                About <span className="text-gradient">Anas Obeidat</span>
              </h1>
              <p className="text-lg text-gray-600">
                Full Stack Developer, Educator, and Content Creator
              </p>
            </div>
          </div>
        </section>
        
        <BioSection />
        
        <SkillsSection />
        
        {/* CTA section */}
        <section className="bg-primary text-white py-16">
          <div className="container-custom text-center">
            <h2 className="text-3xl font-display font-bold mb-6">Let's Work Together</h2>
            <p className="text-lg mb-8 max-w-2xl mx-auto">
              Whether you have a project in mind or just want to say hi, I'd love to hear from you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contact">
                <Button size="lg" variant="secondary" className="px-6">
                  Contact Me
                </Button>
              </Link>
              <a href="https://github.com/Anasobeidat02" target="_blank" rel="noopener noreferrer">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/20 px-6">
                  View My Work
                </Button>
              </a>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default About;
