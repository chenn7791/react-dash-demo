import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  'zh-CN': {
    translation: {
      app: {
        badge: 'React 18 + TypeScript + Redux Toolkit + MUI',
        title: '客户端计数器',
        countLabel: '当前计数',
        language: '语言',
      },
      language: {
        zh: '中文',
        en: 'English',
      },
      counter: {
        decrement: '-1',
        increment: '+1',
        incrementByAmount: '+5',
      },
    },
  },
  en: {
    translation: {
      app: {
        badge: 'React 18 + TypeScript + Redux Toolkit + MUI',
        title: 'Client Counter',
        countLabel: 'Current count',
        language: 'Language',
      },
      language: {
        zh: '中文',
        en: 'English',
      },
      counter: {
        decrement: '-1',
        increment: '+1',
        incrementByAmount: '+5',
      },
    },
  },
} as const;

i18n.use(initReactI18next).init({
  resources,
  lng: 'zh-CN',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
