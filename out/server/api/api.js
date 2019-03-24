const express = require('express');
const path = require('path');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const router = express.Router();


const User = require('../models/user');


const db = require('../config/db');

mongoose.connect(db.uri, err=>{
		if (err){
				console.error('Error, could not connect to database: '+err)
		}else {
				console.log('Connected to mongodb')
		}
});

router.get('/', (req, res)=>{
		res.send('This is the RESTful API root')
});

router.get('/userList', (req, res) => {
    User.find({},[],{sort:{username:1}})
        .exec(function(err, users){
            if (err){
                log.console("Error retrieving users")
            }
            else{
                res.json(users);
            }
        });
})

module.exports = router;
