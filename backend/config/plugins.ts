// ./config/plugins.js
module.exports = ({ env }) => ({
  // i18n 플러그인 설정
  i18n: {
    enabled: true,
    config: {
      defaultLocale: 'ko',
      locales: ['ko', 'en'],
    },
  },


});
