require('dotenv').config();  // This line might be redundant in CRA environments

const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    "/swap",
    createProxyMiddleware({
      target: "https://api.1inch.dev",
      changeOrigin: true,
      onProxyReq: (proxyReq) => {
        proxyReq.setHeader("Authorization", `Bearer ${process.env.API_KEY_1INCH}`);
      },
    })
  );
};