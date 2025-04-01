import React from 'react'
import { Mail, Menu, Phone } from 'lucide-react';
import { Button } from '@workspace/ui/components/button';
import { languages, defaultLang } from '@/i18n/ui';
import { useTranslations } from '@/utils/i18n';

const TopBar = () => {
  return (
    <>
      <div className="bg-gray-100 py-2 px-4 flex justify-between items-center text-sm" >
        <div className="flex items-center gap-1">
          <Mail className="w-4 h-4 text-gray-500" />
          <span className="text-gray-600">contact@servemed.co</span>
        </div>
        <div className="flex items-center gap-1">
          <Phone className="w-4 h-4 text-gray-500" />
          <span className="text-gray-600">+66 99 999 9999</span>
        </div>
      </div>
    </>
  )
}

const NavigateBar = ({ lang }: { lang: keyof typeof languages }) => {
  const t = useTranslations(lang as keyof typeof languages);
  return (
    <>
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Button className="md:hidden">
              <Menu className="w-6 h-6" />
            </Button>
            <img src="/ServeMedLogo.avif" alt="Logo" className="h-10" />
          </div>

          <nav className="hidden md:flex items-center gap-6 text-gray-700">
            <a href="/" className="hover:text-green-600">
              {t('nav.services')}
            </a>
            <a href="/about" className="hover:text-green-600">
              {t('nav.about')}
            </a>
            <a href="/" className="hover:text-green-600">
              {t('nav.contact')}
            </a>
          </nav>
          <div className='flex items-center gap-4'>
            <div className='flex items-center space-x-4'>
              {
                Object.entries(languages).map(([code, name]) => (
                  <a
                    key={code}
                    href={`/${code}`}
                    className={`text-sm ${lang === code ? 'text-[#4CAF50] font-bold' : 'text-gray-600'}`}>
                    {name}
                  </a>
                ))
              }
            </div>
            <Button className="bg-green-600 hover:bg-green-700 text-white rounded-full px-4 py-2 text-sm">
              {t('nav.book')}
            </Button>
          </div>
        </div>
      </header></>
  )
}

export { TopBar, NavigateBar }
