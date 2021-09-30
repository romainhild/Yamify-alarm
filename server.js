'use strict';

const express = require('express');
var exphbs  = require('express-handlebars');
const http = require('http');
const https = require('https');
const bodyParser = require('body-parser');
const path = require('path')
const fs = require('fs');
const mongoose = require('mongoose');
require('dotenv').config();

const routes = require('./routes');
const auth = require('./auth');

const app = new express();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.get('/', (req, res) => {
    res.render('index');
});
app.use('/alarms', routes);
app.use(express.static('public'));

const httpPort = 3333;
const httpsPort = 3334;
const options = {auth:{username: process.env.DB_USER, password: process.env.DB_PWD},
		 authSource: process.env.DB_AUTH,
		 dbName: process.env.DB_NAME};
mongoose.connect('mongodb://'+process.env.DB_HOST+':'+process.env.DB_PORT, options, (err) => {
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
		    key: fs.readFileSync('/etc/letsencrypt/live/'+process.env.SERVER+'/privkey.pem'),
		    cert: fs.readFileSync('/etc/letsencrypt/live/'+process.env.SERVER+'/cert.pem'),
		    ca: fs.readFileSync('/etc/letsencrypt/live/'+process.env.SERVER+'/chain.pem'),
		},
		app
	    )
	    .listen(httpsPort, () => {
		console.log('HTTPS Server running on port '+httpsPort);
	    })
    }
});

module.exports = app;
