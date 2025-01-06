const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const PORT = process.env.PORT || 3000;

const allowedOrigin = 'https://bypell.github.io';

app.options('*', (req, res) => {
    const origin = req.headers.origin;
    if (origin && origin.startsWith(allowedOrigin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
        res.setHeader('Access-Control-Allow-Methods', 'GET');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    }
    res.status(204).end();
});

app.use('/scoresaber', createProxyMiddleware({
    target: 'https://scoresaber.com/api',
    changeOrigin: true,
    pathRewrite: {
        '^/scoresaber': ''
    },
    secure: true,
    headers: {
        'Accept': 'application/json'
    },
    onError: (err, req, res) => {
        console.error('Proxy Error:', err);
        res.status(500).send('Proxy Error');
    },
    onProxyReq: (proxyReq, req, res) => {
        console.log(`Proxying request to: ${proxyReq.path}`);
    },
    onProxyRes: (proxyRes, req, res) => {
        const origin = req.headers.origin;
        if (origin && origin.startsWith(allowedOrigin)) {
            proxyRes.headers['Access-Control-Allow-Origin'] = origin;
            proxyRes.headers['Access-Control-Allow-Methods'] = 'GET';
            proxyRes.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization';
        }
        console.log(`Response status: ${proxyRes.statusCode}`);
    }
}));

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});