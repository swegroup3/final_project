var assert = require('assert')
var express = require('../../app')
var request = require('supertest')

describe('api', function() {
	const USER_CREDENTIALS = {
		username: 'User',
		password: 'password'
	};
	const ADMIN_CREDENTIALS = {
		username: 'Admin',
		password: 'password'
	};
	const TEST_FOOD = {
		name: '!Tha Mystery Meat',
		vendor: '!Mystery Meat Inc.',
		price: 10,
		quantity: 10
	};

	var app, agent;
	var savedFood = {};
	var userToken;
	var adminToken;

	before(function(done) {
		app = express.init();
		agent = request.agent(app);

		done();
	});

	describe('login', function() {
		it('should be able to log in to a test user account', function(done) {
			agent.post('/api/login')
				.send(USER_CREDENTIALS)
				.expect(function(res) {
					userToken = res.body.token;
					assert(userToken !== {});
				})
				.expect(200, done);
		})

		it('should be able to sign-in to a test admin account', function(done) {
			agent.post('/api/login')
				.send(ADMIN_CREDENTIALS)
				.expect(function(res) {
					adminToken = res.body.token;
					assert(adminToken !== {});
				})
				.expect(200, done);
		});
	});

	describe('food routes', function() {
		it('should be able to create a new food', function(done) {
			agent.post('/api/food')
				.set('Authorization', adminToken)
				.send(TEST_FOOD)
				.expect(200, done);
		});

		it('should be able to get all food', function(done) {
			agent.get('/api/food')
				.expect(function(res) {
					// For future testing
					res.body.forEach(function(item) {
						if (item.name === TEST_FOOD.name && item.vendor == TEST_FOOD.vendor) {
							Object.assign(savedFood, item);
						}
					});
					assert(savedFood !== {});
				})
				.expect(200, done);
		});

		it('should be able to get a food item by id', function(done) {
			agent.get('/api/food/' + savedFood._id)
				.expect(function(res) {
					assert(res.body.vendor === savedFood.vendor);
				})
				.expect(200, done);
		});

		it('should be able to update a food item by id', function(done) {
			savedFood.name = '!Updated';

			agent.put('/api/food')
				.set('Authorization', adminToken)
				.send(savedFood)
				.expect(200, done);
		});

		it('should be able to delete a food by id', function(done) {
			agent.delete('/api/food/' + savedFood._id)
				.set('Authorization', adminToken)
				.expect(200, done);
		})
	});
});