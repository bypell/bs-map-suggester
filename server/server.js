const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// const allowedOrigins = [
//     'https://bypell.github.io',
//     'http://localhost:3000'
// ];

// const corsOptions = {
//     origin: function (origin, callback) {
//         if (!origin || allowedOrigins.indexOf(origin) !== -1) {
//             callback(null, true);
//         } else {
//             callback(new Error('Not allowed by CORS'));
//         }
//     },
//     methods: ['GET'],
//     allowedHeaders: ['Content-Type', 'Authorization']
// };

// app.use(cors(corsOptions));

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
    // onProxyReq: (proxyReq, req, res) => {
    //     console.log(`Proxying request to: ${proxyReq.path}`);
    // },
    // onProxyRes: (proxyRes, req, res) => {
    //     proxyRes.headers['Access-Control-Allow-Origin'] = allowedOrigin;
    //     console.log(`Received response with status: ${proxyRes.statusCode}`);
    // },
}));

app.listen(PORT, () => {
    console.log(`Proxy server is running on port ${PORT}`);
});