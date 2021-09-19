'use strict';

const express = require('express');
const http = require('http');
const https = require('https');
const bodyParser = require('body-parser');
const path = require('path')
const fs = require('fs');
const mongoose = require('mongoose');

const routes = require('./routes');
const secrets = require('./secrets');
const auth = require('./auth');

const app = new express();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use('/alarms', routes);
app.use( '/', [auth, express.static(path.join(__dirname, 'public'))]);

const httpPort = 3333;
const httpsPort = 3334;
const options = {auth:{username: secrets.dbUser, password: secrets.dbPass},
		 authSource: secrets.dbAuth,
		 dbName: secrets.dbName};
mongoose.connect('mongodb://'+secrets.dbHost+':'+secrets.dbPort, options, (err) => {
    if(err)
	console.log(err);
    else {
	http
	    .createServer(app)
	    .listen(httpPort, () => {
		console.log('HTTP Server running on port '+httpPort);
	    });

	https
	    .createServer(
		{
		    key: fs.readFileSync('/etc/letsencrypt/live/'+secrets.server+'/privkey.pem'),
		    cert: fs.readFileSync('/etc/letsencrypt/live/'+secrets.server+'/cert.pem'),
		    ca: fs.readFileSync('/etc/letsencrypt/live/'+secrets.server+'/chain.pem'),
		},
		app
	    )
	    .listen(httpsPort, () => {
		console.log('HTTPS Server running on port '+httpsPort);
	    })
    }
});

module.exports = app;
