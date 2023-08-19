const mongoose = require('mongoose');
const Joi = require('joi');
const jwt = require("jsonwebtoken");
const config = require("config");

userSchema = new mongoose.Schema({
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
});

userSchema.methods.generateAuthToken = function() {
    return jwt.sign({ _id: this._id }, config.get('jwtPrivateKey'));
}

const User = mongoose.model('User', userSchema);

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