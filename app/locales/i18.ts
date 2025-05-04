// i18n.js
import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './en.json';
import hi from './hi.json';
import pa from './pa.json';

i18next
  .use(initReactI18next)
  .init({
    lng: 'en', // e.g., 'en', 'hi', 'pa'
    fallbackLng: 'en',
    resources: {
      en: { translation: en },
      hi: { translation: hi },
      pa: { translation: pa },
    },
    // interpolation: { escapeValue: false },
  });
  export default i18next;


