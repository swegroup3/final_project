var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var foodItemSchema = new Schema({
	name: String,
	vendor: String,
	price: {
		type: Number,
		get: x => Math.round(x),
		set: x => Math.round(x)
	},
	price: Number,
	created_at: Date,
	updated_at: Date
});

foodItemSchema.pre('save', function(next) {
	var currentTime = new Date();
	this.updated_at = currentTime;
	if (!this.created_at)
		this.created_at = currentTime;

	next();
});

// Export the model
FoodItem = mongoose.model('FoodItem', foodItemSchema);
module.exports = FoodItem;
