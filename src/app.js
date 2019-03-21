var express = require('express');
var path = require('path');
var morgan = require('morgan');
var bodyParser = require('body-parser');

var app = express();

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(express.static(__dirname));

app.get('/*', function(req, res) {
	res.sendFile(path.join(__dirname, 'index.html'));
});
app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

if (app.get('env') === 'development') {
	app.listen(4201, function() {
		console.log('Listening on port 4201');
	});
}
else {
	app.listen(8080, function() {
		console.log('Listening on port 8080');
	});
}

module.exports = app;
