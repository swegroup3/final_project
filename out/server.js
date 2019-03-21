var express = require('express');
var path = require('path');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var config = require('./server/config');

const CLIENT_PATH = __dirname + '\\client';

// Initialize app
var app = express();

app.use(morgan('dev'));
app.use(bodyParser.json());

// Serve Angular app
app.use(express.static(CLIENT_PATH));
app.get('/*', function(req, res) {
	res.sendFile(path.join(CLIENT_PATH, 'index.html'));
});

app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// Listen
if (app.get('env') === 'development') {
	app.listen(4201, function() {
		console.log('Listening on port 4201');

		mongoose.connect(config.db.uri);
	});
}
else {
	app.listen(8080, function() {
		console.log('Listening on port 8080');
	});
}

module.exports = app;
