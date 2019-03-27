const express = require('express');
const path = require('path');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const router = express.Router();


const FoodItem = require('../models/foodItem');
const User = require('../models/user');


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

// FOR DEBUGGING PURPOSES, view all the users
router.get('/userList', (req, res) => {
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

// FOR DEBUGGING PURPOSES, view all the food
router.get('/foodList', (req, res) => {
    FoodItem.find({}).exec((err, list) => {
        if (err)
            console.log(err);
        else
            res.json(list);
    });
});

router.route('/foodItem')
    .get((req, res) => {
        // I really just put this here as an example for chaining with .route
    })
    .post((req, res) => {
        console.log(req.headers);
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

module.exports = router;
