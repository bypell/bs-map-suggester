const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';
const ALLOWED_ORIGIN = 'https://bypell.github.io';

app.use((req, res, next) => {
    const origin = req.headers.origin;
    console.log(`Request from origin: ${origin}`);

    if (NODE_ENV !== 'development' && origin !== ALLOWED_ORIGIN) {
        console.log(`Blocked request from unauthorized origin: ${origin}`);
        return res.status(403).json({ error: 'Unauthorized origin' });
    }
    console.log(`Allowed request from origin: ${origin}`);

    res.header('Access-Control-Allow-Origin', origin || '*');
    res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.options('*', (req, res) => {
    res.status(200).end();
});

app.get('/', (req, res) => {
    res.send('Server running on port ' + PORT);
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
    onProxyRes: (proxyRes, req, res) => {
        // proxyRes.headers['Access-Control-Allow-Origin'] = ALLOWED_ORIGIN;
        console.log(`Proxy response status: ${proxyRes.statusCode}`);
    }
}));

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT} in ${NODE_ENV} mode`);
});