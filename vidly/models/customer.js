const mongoose = require('mongoose');
const Joi = require('joi');

const Customer = mongoose.model('Customer', new mongoose.Schema({
    isGold: {
        type: Boolean,
        default: false
    },
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50,
        trim: true
    },
    phone: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50,
        trim: true
    }
})); 

function validateCustomer(customer) {
    const Schema = Joi.object({
        name: Joi.string().min(5).max(50).required(),
        phone: Joi.string().min(5).max(50).required(),
        isGold: Joi.boolean()
    })
    return result = Schema.validate(customer);
}

exports.Customer = Customer;
exports.validate = validateCustomer;