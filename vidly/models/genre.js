const mongoose = require('mongoose');
const Joi = require('joi');

const Genre = mongoose.model('Genre', new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50,
        trim: true
    }
})); 

function validateGenre(genre) {
    const Schema = Joi.object({
        name: Joi.string().min(2).required(),
    })
    return result = Schema.validate(genre);
}

exports.Genre = Genre;
exports.validate = validateGenre;
