var config = require('./config');
var path = require('path');
var assetsPath = path.resolve(__dirname,'static', 'dist');
var host = process.env.HOST || 'localhost';
//var port = process.env.LC_APP_PORT || process.env.PORT || 3000;
var apiPort = process.env.APIPORT || 3030;
var staticPort = process.env.STATIC_PORT || 3001;


var webpack = require("webpack");

module.exports = {
	context: path.resolve(__dirname, 'src'),
	entry: "./main.js",
	output: {
		path: assetsPath,
		filename: "[name].bundle.js",
		chunkFilename: "[name].chunk.js",
		publicPath: '/dist/'
	},
	//port:port,
	apiHost:host,
	apiPort:apiPort,
	staticHost:host,
	staticPort:staticPort,
	module: {
		loaders: [
			{
				test: /\.jsx?$/,
				exclude: /node_modules/,
				loaders: ["babel?stage=0"]
			},
			{
				test: /\.html$/,
				loader: "file?name=[name].[ext]",
			},
			{
				test: /\.scss$/,
				loader: "style!css!sass",
			},
			{
				test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
				loader: "url?limit=10000&minetype=application/font-woff"
			},
			{
				test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
				loader: "file" 
			},
			{
				test: /\.(png|jpg|gif)$/,
				loader: 'url?limit=10000'
			},
			{
				test: /\.json$/,
				loader: 'json'
			},
		],
	},
	resolve: {
		modulesDirectories: [
			'src',
			'node_modules'
		],
		alias: {
			app: __dirname + "/app/scripts",
			styles: __dirname + "/app/styles",
			themes: __dirname + "/app/themes",
			vendors: __dirname + "/app/vendors",
		},
		extensions: ["",".jsx",".js"]
	},
	plugins: [
		new webpack.DefinePlugin({
			__CLIENT__: true,
			__SERVER__: false,
			__DEVELOPMENT__: true,
			__DEVTOOLS__: false,
            __LC_APP_ID__: JSON.stringify(config.LC_APP_ID),
            __LC_APP_KEY__: JSON.stringify(config.LC_APP_KEY)
		}),
	]
};

