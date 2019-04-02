const express = require('express');
const path = require('path');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const router = express.Router();


const FoodItem = require('../models/foodItem');
const User = require('../models/user');
const Cart = require('../models/cart');
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

// Add item to cart, create cart if one does not exist for the user
router.post('/cart/', verifyOwnerBody, (req, res) => {
    var username = req.body.username;
    var foodItemName = req.body.foodItemName;
    
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

            FoodItem.findOne({name: foodItemName}, (err, item) => {
                if (err)
                    console.log(err);
                else {
                    var foundIndex = undefined;
                    foundCart.items.forEach((item, index) => {
                        if (item.name == foodItemName)
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
    var foodItemName = req.body.foodItemName;

    Cart.findOne({username: username}, (err, foundCart) => {
        if (err)
            console.log(err)
        else {
            var foundIndex = undefined;
            foundCart.items.forEach((item, index) => {
                if (item.name == foodItemName)
                    foundIndex = index;
            });

            if (foundIndex != undefined) {
                foundCart.items[foundIndex].quantity--;
                console.log(foundCart.items[foundIndex])
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
    var errorFlag = false;

    Cart.findOneAndDelete({username: username}, (err, cart) => {
        if (err)
            console.log(err);
        else {
            if (cart) {
                // Check if the order is valid
                itemNames = [];
                newCart = [];
                cart.items.forEach(item => {
                    itemNames.push(item.name);
                    newCart.push({
                        name: item.name,
                        quantity: item.quantity
                    });
                });

                FoodItem.find({'name': {$in: itemNames}}, (err, foundItems) => {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        var toUpdate = [];
                        var toDelete = [];

                        var compare = function(x, y) {
                            return x.name.localeCompare(y.name);
                        }

                        newCart.sort(compare);
                        foundItems.sort(compare);

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
                                    name: item.name
                                });
                            }
                            else {
                                toUpdate.push({
                                    name: item.name,
                                    newQuantity: newQuantity
                                });
                            }
                        });
                        
                        if (!errorFlag) {
                            // Update the items with a non-zero quantity
                            toUpdate.forEach(item => {
                                FoodItem.findOneAndUpdate({name: item.name}, {
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
                                FoodItem.findOneAndDelete({name: item.name}, (err, foodItem) => {
                                    if (err)
                                        console.log(err);
                                    else {
                                        console.log("Deleted an item:");
                                        console.log(foodItem);
                                    }
                                });
                            });

                            console.log(errorFlag);

                            data = {
                                cart: cart,
                                pin: Math.floor(Math.random() * 10000)
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

module.exports = router;
