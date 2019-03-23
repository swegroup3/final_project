var express = require('express');
var path = require('path');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var db = require('./server/config/db');

var FoodItem = require('./server/models/foodItem');

const NG_APP_PATH = path.join(__dirname,  '/ng-app');

// Initialize app
var app = express();
app.use(morgan('dev'));
app.use(bodyParser.json());

// Serve Angular app
app.use(express.static(NG_APP_PATH));
app.get('/*', function(req, res) {
	res.sendFile(path.join(NG_APP_PATH, 'index.html'));
});

// Listen
app.listen(process.env.PORT || 4201, function() {
	console.log('Listening!');

	mongoose.connect(db.uri);
});



/* Testing the database, foodItem model 
var wholeMilk = {
	name: 'Whole Milk',
	vendor: 'Publix',
	price: 1850
};
new FoodItem(wholeMilk).save(function(err, foodItem) {
	if (err)
		console.log(err);
	else
		console.log(foodItem);
});
*/