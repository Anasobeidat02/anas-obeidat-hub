
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import LanguageToggle from './LanguageToggle';
import { useTranslation } from 'react-i18next';

const Navbar = () => {
  const { t } = useTranslation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: t('navigation.home'), href: '/' },
    { name: t('navigation.videos'), href: '/videos' },
    { name: t('navigation.about'), href: '/about' },
    { name: t('navigation.contact'), href: '/contact' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <nav
      className={cn(
        'fixed w-full z-50 transition-all duration-300',
        isScrolled
          ? 'bg-white/90 backdrop-blur-sm shadow-md py-2'
          : 'bg-transparent py-4'
      )}
    >
      <div className="container-custom">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-xl font-display font-bold text-primary">Anas Obeidat</span>
          </Link>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  'text-sm font-medium transition-colors hover:text-primary',
                  location.pathname === item.href
                    ? 'text-primary font-semibold'
                    : 'text-foreground'
                )}
              >
                {item.name}
              </Link>
            ))}
            <div className="flex items-center gap-4">
              <LanguageToggle />
              <a 
                href="https://github.com/Anasobeidat02" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <Button variant="outline" size="sm">
                  GitHub
                </Button>
              </a>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-2">
            <LanguageToggle />
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-md"
            >
              <div className="w-6 flex flex-col space-y-1.5">
                <span
                  className={cn(
                    'block h-0.5 bg-foreground rounded-full transition-all',
                    isMobileMenuOpen && 'rotate-45 translate-y-2'
                  )}
                ></span>
                <span
                  className={cn(
                    'block h-0.5 bg-foreground rounded-full transition-all',
                    isMobileMenuOpen && 'opacity-0'
                  )}
                ></span>
                <span
                  className={cn(
                    'block h-0.5 bg-foreground rounded-full transition-all',
                    isMobileMenuOpen && '-rotate-45 -translate-y-2'
                  )}
                ></span>
              </div>
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        <div
          className={cn(
            'md:hidden absolute left-0 right-0 transition-all duration-300 bg-white/90 backdrop-blur-sm shadow-md',
            isMobileMenuOpen
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 -translate-y-4 pointer-events-none'
          )}
        >
          <div className="container py-4 flex flex-col space-y-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  'py-2 text-sm font-medium transition-colors hover:text-primary',
                  location.pathname === item.href
                    ? 'text-primary font-semibold'
                    : 'text-foreground'
                )}
              >
                {item.name}
              </Link>
            ))}
            <a 
              href="https://github.com/Anasobeidat02" 
              target="_blank" 
              rel="noopener noreferrer"
              className="py-2"
            >
              <Button variant="outline" size="sm" className="w-full">
                GitHub
              </Button>
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
