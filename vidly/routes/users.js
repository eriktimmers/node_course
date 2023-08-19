const {User, validate} = require('../models/user');
const mongoose = require('mongoose');
const express = require('express');
const bcrypt = require('bcrypt');
const { Customer } = require("../models/customer");
const SALT_WORK_FACTOR = 10;

const router = express.Router();

router.post('/', async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const duplicateuser = await User.findOne({  email: req.body.email });
    if (duplicateuser) return res.status(400).send('Email already exists.');

    let password = req.body.password;

    const user = new User({
        username: req.body.username,
        email: req.body.email
    });

    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        // hash the password using our new salt
        bcrypt.hash(password, salt, function(err, hash) {
            // override the cleartext password with the hashed one
            user.password = hash;
            saveTheUser(res, user);
        });
    });
});

async function saveTheUser(res, user) {
    await user.save();
    res.send(user);
}

module.exports = router;