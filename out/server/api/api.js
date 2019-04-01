const express = require('express');
const path = require('path');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const router = express.Router();


const FoodItem = require('../models/foodItem');
const User = require('../models/user');
const secret_key = "X6jDkr1zqn2Du7uUnjT0CA5wem660RYc32M2F9COPEgYY5px2KYy7OuVWtEcg6E"

const db = require('../config/db');

mongoose.connect(db.uri, err => {
    if (err) {
        console.error('Error, could not connect to database: '+err);
    } else {
        console.log('Connected to mongodb');
    }
});

router.get('/', (req, res) => {
	res.send('This is the RESTful API root');
});

//To be called for Admin-only routes
function verifyAdmin(req, res, next) {
    if (!req.headers.authorization){
        return res.status(401).send('Unauthorized request')
    }
    let token = req.headers.authorization
    if (token === 'null'){
        return res.status(401).send('Unauthorized request')
    }
    let payload = jwt.verify(token, secret_key)
    if (!payload) {
        return res.status(401).send('Unauthorized request')
    }
	if (payload.type != "admin"){
		return res.status(401).send('Unauthorized request')
	}
    next()
}

//To be called for Admin, Employee, and Vendor-only functions
function verifyEVA(req, res, next) {
    if (!req.headers.authorization){
        return res.status(401).send('Unauthorized request')
    }
    let token = req.headers.authorization
    if (token === 'null'){
        return res.status(401).send('Unauthorized request')
    }
    let payload = jwt.verify(token, secret_key)
    if (!payload) {
        return res.status(401).send('Unauthorized request')
    }
	if (payload.type != "admin" && payload.type != "vendor" && payload.type != "employee"){
		return res.status(401).send('Unauthorized request')
	}
    next()
}

//To be called for routes restricted to their owner
function verifyOwnerBody(req, res, next) {
    if (!req.headers.authorization){
        return res.status(401).send('Unauthorized request')
    }
    let token = req.headers.authorization
    if (token === 'null'){
        return res.status(401).send('Unauthorized request')
    }
    let payload = jwt.verify(token, secret_key)
    if (!payload) {
        return res.status(401).send('Unauthorized request')
    }
	if (payload.username != req.body.username){
		return res.status(401).send('Unauthorized request')
	}
    next()
}

//Register route (unrestricted)
router.post('/register', (req, res)=>{
	let userData = req.body
    let user = new User(userData);
    console.log(user);
	user.setPassword(userData.password);
    user.type = "user";
	var id = mongoose.Types.ObjectId();
	user._id = id;
	user.save((error, registeredUser)=>{
		if (error) {
			console.log(error)
		} else {
		    let payload = {username: userData.username, type: user.type}
		    let token = jwt.sign(payload, secret_key)
			res.status(200).send({token})
		}
	})
})


//Login route (unrestricted)
router.post('/login', (req, res)=>{
	let userData = req.body

	User.findOne({username: userData.username}, (error, user)=>{
		if (error) {
			console.log(error)
		} else {
			if(!user) {
				res.status(401).send('Invalid user')
			} else
			if (!user.validPassword(userData.password)){
				res.status(401).send('Invalid password')
			} else {
			    payload = { username: userData.username, type: user.type}
			    let token = jwt.sign(payload, secret_key)
				res.status(200).send({token})
			}
		}
	})
})

//View a specific user, admin version
router.get('/admin/user/:name', verifyAdmin, (req, res) => {

    User.findOne({username: req.params.username}), (err, user) => {
        if (err)
            console.log(err);
        else
            res.json(user);
    };
});

//View self, restricted to same user
router.get('/user/:name', (req, res) => {

  if (!req.headers.authorization){
      return res.status(401).send('Unauthorized request')
  }
  let token = req.headers.authorization
  if (token === 'null'){
      return res.status(401).send('Unauthorized request')
  }
  let payload = jwt.verify(token, secret_key)
  if (!payload) {
      return res.status(401).send('Unauthorized request')
  }
if (payload.username != req.params.name){
  var errormessage = "Unauthorized request, token name is : " + payload.name + ", request name is : " + req.params.name
  return res.status(401).send(errormessage)
}

    let thisname = req.params.name
    User.findOne({username: thisname}, (err, user) => {
        if (err){
          console.log(err);
        }
        else{
          res.json(user);
        }
    })
});

// View all the users, admin-only
router.get('/user', verifyAdmin, (req, res) => {
    User.find({},[],{sort:{username:1}})
        .exec(function(err, users){
            if (err){
                log.console("Error retrieving users");
            }
            else{
                res.json(users);
            }
        });
});

// View all the food, unrestricted
router.get('/food', (req, res) => {
    FoodItem.find({}).exec((err, list) => {
        if (err)
            console.log(err);
        else
            res.json(list);
    });
});

// View a specific food item, unrestricted
router.get('/food/:name', (req, res) => {
    FoodItem.findOne({name: req.params.name}, (err, item) => {
        if (err)
            console.log(err);
        else
            res.json(item);
    });
});

//Add a new food item to the menu
router.post('/food/', verifyEVA, (req, res) => {
    var foodItem = new FoodItem(req.body);
    foodItem.save(function(err) {
        if (err) {
            console.log(err);
            res.status(400).send(err);
        }
        else
            res.json(foodItem);
    });
});

//Update a food item by name, Employee, Vendor, Admin-only
router.put('/food/', verifyEVA, (req, res) => {
    FoodItem.findOneAndUpdate({name: req.body.name},
	{
	$set:{vendor:req.body.vendor, price: req.body.price,quantity: req.body.quantity}
	}, (err, doc) =>{
		if(err){
			console.log(err);
			res.status(400).send(err);
		}
		else res.json(doc);
	});
});

//Delete a food item by name, Employee, Vendor, Admin-only
router.delete('/food/:name', verifyEVA, (req, res) => {
    FoodItem.findOneAndDelete({name: req.params.name}, (err, item) => {
        if (err)
            console.log(err);
        else
            res.json(item);
    });
});

//Delete all food items, clearing the menu, Employee, Vendor, Admin-only
router.delete('/food/', verifyEVA, (req, res) => {
    FoodItem.deleteMany({}, (err) => {
        if (err)
            console.log(err);
    });
});

//Update a user's profile by name, restricted to that user
router.put('/user/', verifyOwnerBody, (req, res) => {
    User.findOneAndUpdate({username: req.body.username}, {$set:{email:req.body.email, firstname:req.body.firstname, lastname:req.body.lastname}}, (err, doc) =>{
		if(err){
			console.log(err);
			res.status(400).send(err);
		}
		else res.json(doc);
	});
});

//Update a user's type, admin-only
router.put('/admin/user/', verifyAdmin, (req, res) => {
    User.findOneAndUpdate({username: req.body.username},
	{
		$set:{type:req.body.type}
	}, (err, doc) =>{
		if(err){
			console.log(err);
			res.status(400).send(err);
		}
		else res.json(doc);
	});
});

//Delete a user by name, Admin-only
router.delete('/user/:user', verifyEVA, (req, res) => {
    User.findOneAndDelete({username: req.params.username}, (err, item) => {
        if (err)
            console.log(err);
        else
            res.json(item);
    });
});


module.exports = router;
