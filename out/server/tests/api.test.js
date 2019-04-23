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

	var app, agent;
	var userToken = {};
	var adminToken = {};

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
					Object.assign(userToken, res.body.token);
					assert(userToken !== {});
				})
				.expect(200, done);
		})

		it('should be able to sign-in to a test admin account', function(done) {
			agent.post('/api/login')
				.send(ADMIN_CREDENTIALS)
				.expect(function(res) {
					Object.assign(adminToken, res.body.token);
					assert(adminToken !== {});
				})
				.expect(200, done);
		});
	});

	describe('public food routes', function() {
		it('should be able to get all food', function(done) {
			agent.get('/api/food')
				.expect(200, done);
		});

		it('should be able to get a single food item by name', function(done) {
			// Test item: Yogurt from Menchie's
			agent.get('/api/food/' + 'Yogurt')
				.expect(function(res) {
					assert(res.body.vendor == 'Menchie\'s');
				})
				.expect(200, done);
		});
	});
});