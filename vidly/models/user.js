const mongoose = require('mongoose');
const Joi = require('joi');

const User = mongoose.model('User', new mongoose.Schema({
    username: {
        type: String,
        required: true,
        minlength: 8,
        maxlength: 25
    },
    email: {
        type: String,
        required: true,
        minlength: 8,
        maxlength: 255,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
        maxlength: 1024
    }
}));

function validateUser(user) {
    const Schema = Joi.object({
        username: Joi.string().min(8).max(25).required(),
        email: Joi.string().min(8).max(255).required().email(),
        password: Joi.string().min(8).max(255).required()
    });
    return result = Schema.validate(user);
}

exports.User = User;
exports.validate = validateUser;