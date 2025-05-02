
import { Link } from 'react-router-dom';
import { socialLinks } from '@/lib/data';
import { useTranslation } from 'react-i18next';

const Footer = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 border-t">
      <div className="container-custom py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="inline-block mb-4">
              <h3 className="text-xl font-display font-bold text-primary">Anas Obeidat</h3>
            </Link>
            <p className="text-gray-600 mb-4 max-w-md">
              {t('footer.bio')}
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((link) => (
                <a 
                  key={link.name}
                  href={link.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  aria-label={link.name}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 hover:bg-primary hover:text-white transition-colors"
                >
                  <span>{link.name.charAt(0)}</span>
                </a>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="font-display font-semibold text-sm uppercase mb-4">{t('footer.navigation')}</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-600 hover:text-primary transition-colors">{t('navigation.home')}</Link>
              </li>
              <li>
                <Link to="/videos" className="text-gray-600 hover:text-primary transition-colors">{t('navigation.videos')}</Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-600 hover:text-primary transition-colors">{t('navigation.about')}</Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-600 hover:text-primary transition-colors">{t('navigation.contact')}</Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-display font-semibold text-sm uppercase mb-4">{t('footer.resources')}</h4>
            <ul className="space-y-2">
              <li>
                <a 
                  href="https://github.com/Anasobeidat02" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-primary transition-colors"
                >
                  {t('footer.github')}
                </a>
              </li>
              <li>
                <a 
                  href="https://youtube.com/@anas_obeidat?si=J-RWY9vjBpIxRYGe" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-primary transition-colors"
                >
                  {t('footer.youtube')}
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t mt-10 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-500">
            © {currentYear} Anas Obeidat. {t('footer.rights')}
          </p>
          <div className="mt-4 md:mt-0 text-sm text-gray-500 flex space-x-4">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
