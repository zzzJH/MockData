import express from 'express';

import httpProxy from 'http-proxy';

import config from '../webpack.config';

const app = express();


const proxy = httpProxy.createProxyServer();

// Proxy to API server
// app.use('/api', (req, res) => {
//   proxy.web(req, res, {
//   	target: `http://${config.apiHost}:${config.apiPort}`, 
//   	ws:true 
//   });
// });

// proxy.on('proxyReq', function(proxyReq, req, res, options) {
//   // console.log(req.url)
// });

// // added the error handling to avoid https://github.com/nodejitsu/node-http-proxy/issues/527
// proxy.on('error', (error, req, res) => {
//   let json;
//   if (error.code !== 'ECONNRESET') {
//     console.error('proxy error', error);
//   }
//   if (!res.headersSent) {
//     res.writeHead(500, {'content-type': 'application/json'});
//   }

//   json = {error: 'proxy_error', reason: error.message};
//   res.end(JSON.stringify(json));
// });
