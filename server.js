'use strict';

const express = require('express');
const http = require('http');
const https = require('https');
const bodyParser = require('body-parser');
const path = require('path')
const fs = require('fs');
const mongoose = require('mongoose');

const secrets = require('./secrets');

const app = new express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')))

app
    .get('/', (req, res) => {
	res.sendFile(path.join(__dirname, 'public/index.html'));
    })
    .post('/', (req, res) => {
    })
    .get('/list', (req, res) => {
	res.status(200).send({ nbAlarm: 1, alarms: [{id: '1', name: 'toto'}]});
    })
    .get('/id/:id', (req, res) => {
    })
    .delete('/id/:id', (req, res) => {
    })
    .put('/id/:id', (req, res) => {
    });

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
