import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18next
  .use(LanguageDetector) // Detects the user's language
  .use(initReactI18next) // Binds i18next to React
  .init({
    fallbackLng: 'en', // Default language if the user's language is not supported
    debug: true, // Enable debugging in development
    resources: {
      en: {
        translation: {
          welcome: 'Welcome',
          greeting: 'Hello, {{name}}!',
          premium: 'Premium',
        }
      },
      zh_HK: {
        translation: {
          welcome: 'Bienvenue',
          greeting: 'Bonjour, {{name}}!',
          premium: '保費總額',
        }
      },
      zh_CN: {
        translation: {
          welcome: 'Bienvenue',
          greeting: 'Bonjour, {{name}}!',
          premium: '保费总额',
        }
      },
      
      // Add more languages as needed
    }
  });

export default i18next;