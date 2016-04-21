import path from 'path';
import express from 'express';
import https from 'https';

import httpProxy from 'http-proxy';
import favicon from 'serve-favicon';
import compression from 'compression';

import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
//import config from '../webpack.config';
import webpackConfig from '../webpack.config';
import config from '../config';


const app = express();
app.use(compression());
app.use(favicon(path.join(__dirname, '..', 'static', 'favicon.ico')));

const proxy = httpProxy.createProxyServer();

// // Proxy to API server
// app.use('/api', (req, res) => {
//   proxy.web(req, res, {
//     target: `http://${webpackConfig.apiHost}:${webpackConfig.apiPort}`,
//     ws:true 
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

app.get('/api', function(req, res) {
    var query = req.query,
        path;
    console.log(req.query, req.url);
    if (query.limit != undefined) {
      path = query['class'] + "?/limit=" + query['limit'];
    } else {
      path = query['class'] + "/" + query['id'];
    }
    var options = {
        method: 'GET',
        host: 'leancloud.cn',
        port: '443',
        path: '/1.1/classes/' + path,
        headers: {
            "X-LC-Id": "zq0bXlTNKYqP2fJOjewIGhtm-gzGzoHsz",
            "X-LC-Key": "fzLvwMrXq8s2YCyoBdYJ9aIP",
            "Content-Type": "application/json;charset=utf-8"
        }
    };
    var reqCloud = https.request(options, function(resCloud) {
        console.log(resCloud.statusCode);
        console.log("headers: ", resCloud.headers);
        if (resCloud.statusCode == 200) {
            resCloud.on('data', function(data) {
                console.log(data);
                var str = unescape(data.toString('utf-8').replace(/\\u/g, '%u'));
                res.write(str);
                res.end();
            });
        }
    });
    reqCloud.on('error', function(e) {
        console.error(e);
    });
    reqCloud.end();
});

var serverOptions = {
    quiet: true,
    noInfo: true,
    hot: true,
    inline: true,
    lazy: false,
    publicPath: webpackConfig.output.publicPath,
    headers: {
        'Access-Control-Allow-Origin': '*'
    },
    stats: {
        colors: true
    }
};
//app.use(require('serve-static')(path.join(__dirname, '..', 'static')));

const compiler = webpack(webpackConfig);
app.use(webpackDevMiddleware(compiler, serverOptions));
app.use(webpackHotMiddleware(compiler));



app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(config.port, error => {
    if (error) {
        console.log(error);
        return;
    }

    console.log("Listening at http://0.0.0.0:%s", config.port);
});
