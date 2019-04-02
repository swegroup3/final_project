const mongoose = require('mongoose');
const crypto = require('crypto')
var Schema = mongoose.Schema;

const userSchema = new Schema({
	firstname: String,
	lastname: String,
	username: String,
	hash: String,
	salt: String,
	type: String, 
	email: String
});

userSchema.methods.setPassword = function(password) {
	this.salt = crypto.randomBytes(16).toString('hex');
	this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
};

userSchema.methods.validPassword = function(password) {
	var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
	return this.hash === hash;
};


// Export the model
User = mongoose.model('User', userSchema, 'Users');
module.exports = User;