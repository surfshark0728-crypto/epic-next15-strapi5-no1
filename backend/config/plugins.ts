//export default () => ({});

module.exports = ({ env }) => ({
  upload: {
    config: {
      breakpoints: {
        large: 1000,
        medium: 750,
        small: 500,
        thumbnail: 245,
      },
      sizeOptimization: false, 
    },
  },
});
