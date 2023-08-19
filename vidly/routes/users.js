const _ = require('lodash');
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

    const user = new User(_.pick(req.body, ['username', 'email']));

    const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
    const hash = await bcrypt.hash(password, salt);
    user.password = hash;
    await user.save();
    res.send(_.pick(user, ['_id', 'username', 'email']));
});

module.exports = router;