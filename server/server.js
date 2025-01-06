const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

app.use('/scoresaber', createProxyMiddleware({
    target: 'https://scoresaber.com',
    changeOrigin: true,
    pathRewrite: {
        '^/api': '/api',
    },
    onProxyRes: (proxyRes, req, res) => {
        proxyRes.headers['Access-Control-Allow-Origin'] = '*';
    },
}));

app.listen(PORT, () => {
    console.log(`Proxy server is running on port ${PORT}`);
});
