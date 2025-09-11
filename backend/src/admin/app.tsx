import type { StrapiApp } from '@strapi/strapi/admin';
import ko from './locales/ko.json';

export default {
    config: {
      locales: ['ko'], 
      defaultLocale: 'ko',
      translations: {
        ko,
      },
    },

    register(StrapiApp: StrapiApp) {

      if (typeof window !== "undefined") {
        const locale = localStorage.getItem("strapi-admin-language");
        if(!locale) {
          localStorage.setItem("strapi-admin-language", "ko");
          window.location.reload(); // 한 번만 리로드
        } 
      }
  
    },
    bootstrap() {},
};
  