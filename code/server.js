/*eslint no-console:0 */
'use strict';
require('core-js/fn/object/assign');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const config = require('./webpack.config');
const open = require('open');
const express = require('express');
const request = require('request');
//const cors = require('cors');

new WebpackDevServer(webpack(config), config.devServer)
.listen(config.port, 'localhost', (err) => {
	if (err) {
		console.log(err);
	}
	console.log('Listening at localhost:' + config.port);
	console.log('Opening your system browser...');
	open('http://localhost:' + config.port + '/webpack-dev-server/');
});


/**
* { Small express server to proxy request to allowfetching things without throwing CORS errors }
*/

 /**
 * Dependencies
 */
	//Express
	const app = express();
	const expressPort = 8001;

/**
 * Init
 */

	 /**
	* Config
	*/
	//app.options('*', cors());

	app.use(function(req, res, next) {
		// CORS headers
		res.header("Access-Control-Allow-Origin", "*");
		res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
		// Set custom headers for CORS
		res.header("Access-Control-Allow-Headers", "Content-type,Accept,X-Custom-Header");

		if (req.method === "OPTIONS") {
		    return res.status(200).end();
		}

		return next();
	});

	/**
	 * API
	 */

	app.get('/getCurrenciesAndRates', function(req, res) {
		const url = 'http://www.ecb.europa.eu/stats/eurofxref/eurofxref-hist-90d.xml';
		req.pipe(request(url)).pipe(res);
	});

	app.listen(expressPort);