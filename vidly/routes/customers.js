const mongoose = require('mongoose');
const Joi = require('joi');
const express = require('express');

const router = express.Router();

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

router.get('/', async (req, res) => {
    const customer = await Customer.find().sort('name');
    if (!customer) return res.status(404).send('Customer not Found.');
    res.send(customer);
});

router.get('/:id', async (req, res) => {
    const customer = await Customer.findById(req.params.id);

    if (!customer) return res.status(404).send('No Customer found.');
    res.send(customer);
});

router.post('/', async (req, res) => {
    console.log(req.body);
    const { error } = validateCustomer(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    let customer = new Customer({
        name: req.body.name,
        phone: req.body.phone,
        isGold: req.body.isGold
    });

    customer = await customer.save();

    res.send(customer);
});

router.put('/:id', async (req, res) => {
    const { error } = validateCustomer(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let customer = await Customer.findById(req.params.id)
    if (!customer) return res.status(404).send('Genre not Found.');

    customer.name = req.body.name;
    customer.phone = req.body.phone;
    customer.isGold = req.body.isGold;
    const result = await customer.save();
    console.log(result);

    res.send(customer);
});

router.delete('/:id', async (req, res) => {
    const customer = await Customer.findByIdAndRemove(req.params.id);
    if (!customer) return res.status(404).send('Customer not Found.');
    res.send(customer);
});

function validateCustomer(customer) {
    const Schema = Joi.object({
        name: Joi.string().min(5).max(50).required(),
        phone: Joi.string().min(5).max(50).required(),
        isGold: Joi.boolean()
    })
    return result = Schema.validate(customer);
}

module.exports = router;