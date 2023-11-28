const request = require('supertest');
const { Rental } = require("../../models/rental");
const { Movie } = require("../../models/movie");
const { User } = require("../../models/user");
const mongoose = require('mongoose');
const moment = require('moment');

describe('/api/returns', () => {
    let server;
    let customerId;
    let movieId;
    let rental;
    let movie;
    let token;

    beforeEach(async () => {
        server = require('../../index');

        customerId = new mongoose.Types.ObjectId();
        movieId = new mongoose.Types.ObjectId();
        token = new User().generateAuthToken();

        movie = new Movie({
            _id: movieId,
            title: '12345',
            dailyRentalRate: 2,
            genre: { name: '12345' },
            numberInStock: 10
        });
        await movie.save();

        rental = new Rental({
            customer: {
                _id: customerId,
                name: '12345',
                phone: '12345'
            },
            movie: {
                _id: movieId,
                title: '12345',
                dailyRentalRate: 2
            },
            dateReturned: null
        });
        await rental.save();
    });

    afterEach(async () => {
        await server.close();
        await Rental.deleteMany({});
        await Movie.deleteMany({});
    });

    const exec = async () => {
        return request(server)
            .post('/api/returns/')
            .set('x-auth-token', token)
            .send({ customerId, movieId });
    }

    it('test setup should work.', async () => {
        const result = await Rental.findById(rental._id);
        expect(result).not.toBeNull();
    });

    it('should return 401 if client is nog logged in.', async () => {
        token = '';

        const res = await exec();
        expect(res.status).toBe(401);
    });

    it('should return 400 if customerId is not provided.', async () => {
        customerId = null;

        const res = await exec();
        expect(res.status).toBe(400);
    });

    it('should return 400 if movieId is not provided.', async () => {
        movieId = null;

        const res = await exec();
        expect(res.status).toBe(400);
    });

    it('should return 404 if rental is not found.', async () => {
        customerId = new mongoose.Types.ObjectId();
        movieId = new mongoose.Types.ObjectId();

        const res = await exec();
        expect(res.status).toBe(404);
    });

    it('should return 400 if rental is already processed.', async () => {
        rental.dateReturned = '1970-01-01';
        await rental.save();

        const res = await exec();
        expect(res.status).toBe(400);
    });

    it('should return 200 if the request is valid.', async () => {
        const res = await exec();
        expect(res.status).toBe(200);
    });

    it('should set a return date if the request is valid.', async () => {
        const res = await exec();

        const updatedRental = await Rental.findById(rental._id);
        const diff = new Date() - updatedRental.dateReturned;
        expect(diff).toBeLessThan(10 * 1000);
    });

    it('should calculate the Rental Fee if the request is valid.', async () => {
        rental.dateOut = moment().add(-7, 'days').toDate();
        await rental.save();

        const res = await exec();

        const updatedRental = await Rental.findById(rental._id);
        // const amount = moment().diff(rental.dateOut, 'days') * rental.movie.dailyRentalRate;

        expect(updatedRental.rentalFee).toBeCloseTo(14);
    });

    it('should increase the movie stock if the request is valid.', async () => {
        const res = await exec();

        const updatedMovie = await Movie.findById(movie._id);
        expect(updatedMovie.numberInStock).toBe(movie.numberInStock + 1);
    });

    it('should return the rental in the body of the response if the request is valid.', async () => {
        const res = await exec();

        const updatedRental = await Rental.findById(rental._id);

        // expect(res.body).toHaveProperty('_id' );
        // expect(res.body).toHaveProperty('movie');
        // expect(res.body).toHaveProperty('customer');
        // expect(res.body).toHaveProperty('dateOut');
        // expect(res.body).toHaveProperty('dateReturned');
        // expect(res.body).toHaveProperty('rentalFee');

        expect(Object.keys(res.body)).toEqual(expect.arrayContaining([
            'dateOut', 'dateReturned', 'rentalFee', 'customer', 'movie', '_id'
        ]));
    });
});