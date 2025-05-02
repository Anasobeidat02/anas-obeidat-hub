
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';

const LanguageToggle = () => {
  const { i18n, t } = useTranslation();
  const [mounted, setMounted] = useState(false);

  // Set direction of HTML document based on language
  useEffect(() => {
    setMounted(true);
    document.documentElement.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  // If not mounted yet, don't render (to avoid SSR mismatch)
  if (!mounted) return null;

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    // Save to localStorage (already handled by i18next detection plugin)
  };

  // Display current language flag
  const currentFlag = i18n.language === 'ar' ? '🇸🇦' : '🇺🇸';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <Globe className="h-4 w-4" />
          <span>{currentFlag}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => changeLanguage('en')} className="cursor-pointer">
          🇺🇸 {t('language.english')}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => changeLanguage('ar')} className="cursor-pointer">
          🇸🇦 {t('language.arabic')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageToggle;
