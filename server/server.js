const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const PORT = process.env.PORT || 3000;

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.options('*', (req, res) => {
    res.status(200).end();
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
    logLevel: 'debug',
    onError: (err, req, res) => {
        console.error('Proxy Error:', err);
        res.status(500).json({ error: 'Proxy Error' });
    },
    onProxyReq: (proxyReq, req, res) => {
        console.log(`Proxying request to: ${proxyReq.path}`);
    },
    onProxyRes: (proxyRes, req, res) => {
        proxyRes.headers['Access-Control-Allow-Origin'] = '*';
        proxyRes.headers['Access-Control-Allow-Methods'] = 'GET, OPTIONS';
        proxyRes.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization';
        console.log(`Response status: ${proxyRes.statusCode}`);
    }
}));

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});