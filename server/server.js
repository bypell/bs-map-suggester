const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

const allowedOrigin = 'https://bypell.github.io/bs-map-suggester';

const corsOptions = {
    origin: function (origin, callback) {
        if (!origin || origin === allowedOrigin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET'],
    allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));

app.get('/', (req, res) => {
    res.send('ScoreSaber API proxy server');
});

app.get('/test', (req, res) => {
    res.send('Testing');
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
    onProxyReq: (proxyReq, req, res) => {
        console.log(`Proxying request to: ${proxyReq.path}`);
    },
    onProxyRes: (proxyRes, req, res) => {
        proxyRes.headers['Access-Control-Allow-Origin'] = req.headers.origin || '*';
        proxyRes.headers['Access-Control-Allow-Methods'] = 'GET';
        proxyRes.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization';
        console.log(`Received response with status: ${proxyRes.statusCode}`);
    },
}));

app.listen(PORT, () => {
    console.log(`Proxy server is running on port ${PORT}`);
});