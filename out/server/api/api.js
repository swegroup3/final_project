const express = require('express');
const path = require('path');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const router = express.Router();
const crypto = require('crypto');
const nodemailer = require('nodemailer');


const FoodItem = require('../models/foodItem');
const User = require('../models/user');
const Cart = require('../models/cart');
const secret_key = "X6jDkr1zqn2Du7uUnjT0CA5wem660RYc32M2F9COPEgYY5px2KYy7OuVWtEcg6E"

const db = require('../config/db');

var transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: 'bodegadev@gmail.com',
		pass: 'G7H5xRaMWnm2tNc'
	}
});

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

//To be called for Admin and Employee-only functions
function verifyEA(req, res, next) {
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
	if (payload.type != "admin" && payload.type != "employee"){
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

//To be called for create routes restricted to their (vendor) owner
function verifyVendorBody(req, res, next) {
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
	if (payload.username != req.body.vendor){
		return res.status(401).send('Unauthorized request')
	}
	if (payload.type != "vendor"){
		return res.status(401).send('Unauthorized request')
	}
    next()
}
//To verify caller is a vendor
function verifyVendor(req, res, next) {
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
	if (payload.type != "vendor"){
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
		    let payload = {username: userData.username, type: user.type, email:user.email}
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
			    payload = { username: userData.username, type: user.type, email: user.email}
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

// View all the food of a particular vendor (for convenience)
router.get('/vendor/food/:vendor', (req, res) => {
    FoodItem.find({vendor: req.params.vendor}).exec((err, list) => {
        if (err)
            console.log(err);
        else
            res.json(list);
    });
});

// View a specific food item by id, unrestricted
router.get('/food/:_id', (req, res) => {
    FoodItem.findOne({_id: req.params._id}, (err, item) => {
        if (err)
            console.log(err);
        else
            res.json(item);
    });
});

//Add a new food item to the menu, Employee and Admin Only
router.post('/food/', verifyEA, (req, res) => {
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

//Add a new food item to the menu, owner only
router.post('/vendor/food/', verifyVendorBody, (req, res) => {
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

//Update a food item by id, Employee, Admin-only
router.put('/food/', verifyEA, (req, res) => {
    FoodItem.findOneAndUpdate({_id: req.body._id},
	{
        $set: {
            name: req.body.name,
            vendor: req.body.vendor,
            price: req.body.price,
            quantity: req.body.quantity
        }
	}, (err, doc) =>{
		if(err){
			console.log(err);
			res.status(400).send(err);
		}
		else res.json(doc);
	});
});


//Update a food item by id, owner-only
router.put('/vendor/food/', verifyVendor, (req, res) => {
	let token = req.headers.authorization
    let payload = jwt.verify(token, secret_key)
    FoodItem.findOneAndUpdate({_id: req.body._id, payload: token.username},
	{
        $set:{
            name: req.body.name,
            price: req.body.price,
            quantity: req.body.quantity
        }
	}, (err, doc) =>{
		if(err){
			console.log(err);
			res.status(400).send(err);
		}
		else res.json(doc);
	});
});

//Delete a food item by id, Employee, Admin-only
router.delete('/food/:_id', verifyEA, (req, res) => {
    FoodItem.findOneAndDelete({_id: req.params._id}, (err, item) => {
        if (err)
            console.log(err);
        else
            res.json(item);
    });
});
//Delete a food item by id, owner only
router.delete('/vendor/food/:_id', verifyVendor, (req, res) => {
	let token = req.headers.authorization
    let payload = jwt.verify(token, secret_key)
    FoodItem.findOneAndDelete({_id: req.params._id, vendor: payload.username}, (err, item) => {
        if (err)
            console.log(err);
        else
            res.json(item);
    });
});

//Delete all food items, clearing the menu, Employee, Admin-only
router.delete('/food/', verifyEA, (req, res) => {
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
router.delete('/user/:username', verifyEVA, (req, res) => {
    User.findOneAndDelete({username: req.params.username}, (err, item) => {
        if (err)
            console.log(err);
        else
            res.json(item);
    });
});

// Add item to cart, create cart if one does not exist for the user
router.post('/cart/', verifyOwnerBody, (req, res) => {
    var username = req.body.username;
    var foodItemId = req.body._id;

    Cart.findOne({username: username}, (err, foundCart) => {
        if (err)
            console.log(err);
        else {
            // Create a new cart if one does not exist
            if (foundCart == null) {
                foundCart = new Cart({
                    username: username
                });
            }

            FoodItem.findOne({_id: foodItemId}, (err, item) => {
                if (err)
                    console.log(err);
                else {
                    var foundIndex = undefined;
                    foundCart.items.forEach((item, index) => {
                        if (item._id == foodItemId)
                            foundIndex = index;
                    });

                    if (foundIndex != undefined)
                        foundCart.items[foundIndex].quantity++;
                    else {
                        item.quantity = 1;
                        foundCart.items.push(item);
                    }

                    foundCart.save();
                    res.json(foundCart);
                }
            });
        }
    });

});

// Delete item from cart
router.put('/cart/', verifyOwnerBody, (req, res) => {
    var username = req.body.username;
    var foodItemId = req.body._id;
    console.log('request to remove item from cart:', username, foodItemId);

    Cart.findOne({username: username}, (err, foundCart) => {
        if (err)
            console.log(err)
        else {
            var foundIndex = undefined;
            foundCart.items.forEach((item, index) => {
                if (item._id == foodItemId)
                    foundIndex = index;
            });

            if (foundIndex != undefined) {
                foundCart.items[foundIndex].quantity--;
                // console.log(foundCart.items[foundIndex])
                if (foundCart.items[foundIndex].quantity == 0)
                    foundCart.items.splice(foundIndex, 1);
            }
            foundCart.save();
        }
    });
});

// Get the cart
router.get('/cart/:name', (req, res) => {
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

    Cart.findOne({username: req.params.name}, (err, cart) => {
        if (err)
            console.log(err);
        else
            res.json(cart);
    });
});

// Purchase the cart, will also delete the cart
router.post('/cart/purchase/', verifyOwnerBody, (req, res) => {
    var username = req.body.username;
	let token = req.headers.authorization
    let payload = jwt.verify(token, secret_key)
    var errorFlag = false;

    Cart.findOneAndDelete({username: username}, (err, cart) => {
        if (err) {
            console.log(err);
        }
        else {
            if (cart) {
                itemIds = [];
                newCart = [];
                cart.items.forEach(item => {
                    itemIds.push(item._id);
                    newCart.push({
                        _id: item._id,
                        quantity: item.quantity
                    });
                });

                FoodItem.find({'_id': {$in: itemIds}}, (err, foundItems) => {
                    if (err) {
                        console.log(err);
                    }
                    // If the list of requested ids has the same length as the found items,
                    // then we can be sure each id was found (ids have to be unique)
                    else if (itemIds.length != foundItems.length) {
                        var message = "Could not find all items in shopping cart."
                        console.log(message);
                        res.status(409).send(message);
                    }
                    else {
                        var toUpdate = [];
                        var toDelete = [];

                        var orderById = function(x, y) {
                            return toString(x._id).localeCompare(toString(y._id));
                        }

                        // Sorting the ids ensures that the indices in both newCart and foundItems
                        // refers to the same item
                        newCart.sort(orderById);
                        foundItems.sort(orderById);

                        foundItems.forEach((foundItem, index) => {
                            var item = newCart[index];
                            var newQuantity = foundItem.quantity - item.quantity;

                            if (newQuantity < 0) {
                                var message = "Shopping cart contains an invalid quantity.";
                                console.log(message);
                                errorFlag = true;
                                res.status(409).send(message);
                            }
                            else if (newQuantity == 0) {
                                toDelete.push({
                                    _id: item._id
                                });
                            }
                            else {
                                toUpdate.push({
                                    _id: item._id,
                                    newQuantity: newQuantity
                                });
                            }
                        });

                        if (!errorFlag) {
                            // Update the items with a non-zero quantity
                            toUpdate.forEach(item => {
                                FoodItem.findOneAndUpdate({_id: item._id}, {
                                    $set: {quantity: item.newQuantity}
                                }, (err, foodItem) => {
                                    if (err)
                                        console.log(err);
                                    else {
                                        console.log("Updated an item:");
                                        console.log(foodItem);
                                    }
                                });
                            });
                            // Delete the items with a zero quantity
                            toDelete.forEach(item => {
                                FoodItem.findOneAndDelete({_id: item._id}, (err, foodItem) => {
                                    if (err)
                                        console.log(err);
                                    else {
                                        console.log("Deleted an item:");
                                        console.log(foodItem);
                                    }
                                });
                            });
                            var pinnumber = Math.floor(Math.random() * 10000);
                            pinnumber = pinnumber.toString();
                            // Pad the pin with 0s up to a length of 4
                            pinnumber = new Array(1 + 4 - pinnumber.length).join('0') + pinnumber;
							if(payload){
								if(payload.email){
									var mailOptions = {
										from: 'bodegadev@gmail.com',
										to: payload.email,
										subject: 'Receipt for your Bodega purchase.',
										text: 'Your purchase pin is: ' + pinnumber
									};
									transporter.sendMail(mailOptions, function(error, info){
										if(error){
											console.log(error);
										} else {
											console.log('Email sent: ' + info.response);
										}
									});
								}
							}
							
                            data = {
                                cart: cart,
                                pin: pinnumber
                            };
                            console.log(data);
                            res.json(data);
                        }
                    }
                });
            }
            else {
                var message = "No shopping cart found.";
                console.log(message)
                res.status(409).send(message);
            }
        }
    });
});

// Generate a guest token
router.get('/guest/', (req, res) => {
    var randomName = 'guest_' + crypto.randomBytes(10).toString('hex');
    var payload = {
        username: randomName,
        type: 'guest'
    };
    let token = jwt.sign(payload, secret_key)
    // Making an assumption here that this user will not exist in the database
    res.status(200).send({token})
});

module.exports = router;
