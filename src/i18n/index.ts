import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      search: 'Search images...',
      filterByTags: 'Filter by tags:',
      footer: {
        about: 'About',
        contact: 'Contact',
        terms: 'Terms of Service',
        privacy: 'Privacy Policy',
        copyright: '© 2025 ImageAI. All rights reserved.',
      },
    },
  },
  zh: {
    translation: {
      search: '搜索图片...',
      filterByTags: '按标签筛选：',
      footer: {
        about: '关于我们',
        contact: '联系我们',
        terms: '服务条款',
        privacy: '隐私政策',
        copyright: '© 2025 ImageAI. 保留所有权利。',
      },
    },
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en', // Set default language to English
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;