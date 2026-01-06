const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api/gas',
    createProxyMiddleware({
      target: 'https://script.google.com',
      changeOrigin: true,
      pathRewrite: {
        '^/api/gas': '/macros/s/AKfycbxkjBzHgXSVxgcpwLUTybGbgZ53ZT_TIgQ3hbr_Bq2jks959lGezxUARvgKhfzBotN9/exec',
      },
    })
  );
};
