const {Rental, validate} = require('../models/rental');
const {Movie} = require('../models/movie');
const {Customer} = require('../models/customer');
const mongoose = require('mongoose');
const express = require('express');

const router = express.Router();

router.get('/', async (req, res) => {
    const rental = await Rental.find().sort('-dateOut');
    if (!rental) return res.status(404).send('Rentals not Found.');
    res.send(rental);
});

router.post('/', async (req, res) => {
    console.log(req.body);
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const customer = await Customer.findById(req.body.customerId);
    if (!customer) return res.status(400).send('Invalid customer.');

    const movie = await Movie.findById(req.body.movieId);
    if (!movie) return res.status(400).send('Invalid movie.');

    if (movie.numberInStock === 0) return res.status(400).send('Movie not in stock.');

    let rental = new Rental({
        customer: {
            _id: customer._id,
            name: customer.name,
            phone: customer.phone
        },
        movie: {
            _id: movie._id,
            title: movie.title,
            dailyRentalRate: movie.dailyRentalRate
        }
    });

    const db = await mongoose.createConnection('mongodb://localhost/vidly').asPromise();
    const session = await db.startSession();
    try {
        await session.withTransaction(async () => {
            rental.save();
            decNumberInStock(movie._id)
            res.send(rental);
        });
    } finally {
        await session.endSession();
        await db.close();
        console.log('ok')
    }
});

async function decNumberInStock(movieId) {
    const movie = await Movie.findByIdAndUpdate(movieId , {
        $inc : { numberInStock : -1}
    });
    movie.save();
}

module.exports = router;