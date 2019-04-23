const mongoose = require('mongoose');
var FoodItem = require('./foodItem');
var Schema = mongoose.Schema;

const cartSchema = new Schema({
	username: String,
	items: [FoodItem.schema]
});

cartSchema.pre('save', function(next) {
	var currentTime = new Date();
	this.updated_at = currentTime;
	if (!this.created_at)
		this.created_at = currentTime;

	next();
});

CartSchema = mongoose.model('CartSchema', cartSchema, 'Carts');
module.exports = CartSchema;
