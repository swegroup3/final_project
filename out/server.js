var express = require('express');
var path = require('path');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

const NG_APP_PATH = path.join(__dirname,  '/ng-app');
const api = require('./server/api/api');

// Initialize app
var app = express();
app.use(morgan('dev'));
app.use(bodyParser.json());

// Serve Angular app
app.use(express.static(NG_APP_PATH));

//Use API defined in api.js
app.use('/api', api)

app.get('/*', function(req, res) {
	res.sendFile(path.join(NG_APP_PATH, 'index.html'));
});

// Listen
app.listen(process.env.PORT || 4201, function() {
	console.log('Listening!');
});
