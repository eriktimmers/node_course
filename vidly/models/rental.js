const mongoose = require('mongoose');
const Joi = require('joi');
const { genreSchema } = require("./genre");
const moment = require("moment/moment");

const rentalSchema = new mongoose.Schema({
    customer: {
        type: new mongoose.Schema({
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
        }),
        required: true
    },
    movie: {
        type: new mongoose.Schema({
            title: {
                type: String,
                required: true,
                minlength: 5,
                maxlength: 255,
                trim: true
            },
            dailyRentalRate: {
                type: Number,
                required: true,
                min: 0,
                max: 255
            }
        }),
        required: true
    },
    dateOut: {
        type: Date,
        required: true,
        default: Date.now
    },
    dateReturned: {
        type: Date
    },
    rentalFee: {
        type: Number,
        min: 0
    }
});

rentalSchema.statics.lookup = function(customeId, movieId) {
    return this.findOne({
        'customer._id': customeId,
        'movie._id': movieId
    });
}

rentalSchema.methods.return = function() {
    this.dateReturned = new Date();

    this.rentalFee = moment().diff(this.dateOut, 'days') * this.movie.dailyRentalRate;
}

const Rental = mongoose.model('Rental', rentalSchema);

function validateRental(rental) {
    const Schema = Joi.object({
        customerId: Joi.objectId().required(),
        movieId: Joi.objectId().required()
    })
    return result = Schema.validate(rental);
}

exports.Rental = Rental;
exports.validate = validateRental;