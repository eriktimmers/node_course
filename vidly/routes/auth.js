const _ = require('lodash');
const {User} = require('../models/user');
const mongoose = require('mongoose');
const express = require('express');
const bcrypt = require('bcrypt');
const { Customer } = require("../models/customer");
const Joi = require("joi");
const SALT_WORK_FACTOR = 10;

const router = express.Router();

router.post('/', async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({  email: req.body.email });
    if (!user) return res.status(400).send('Invalid user or password.');

    const validPassword = await bcrypt.compare(req.body.password, user.password)
    if (!validPassword) return res.status(400).send('Invalid user or password.');

    res.send(true);
});

function validate(req) {
    const Schema = Joi.object({
        email: Joi.string().min(8).max(255).required().email(),
        password: Joi.string().min(8).max(255).required()
    });
    return result = Schema.validate(req);
}

module.exports = router;