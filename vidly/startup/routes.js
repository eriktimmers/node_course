const express = require('express');
const genreRouter = require('../routes/genres');
const customerRouter = require('../routes/customers');
const movieRouter = require('../routes/movies');
const rentalRouter = require('../routes/rentals');
const returnRouter = require('../routes/returns');
const userRouter = require('../routes/users');
const authRouter = require('../routes/auth');
const error = require('../middleware/error');

module.exports = function(app) {
    // middleware
    app.use(express.json());

    // routers
    app.use('/api/genres', genreRouter);
    app.use('/api/customers', customerRouter);
    app.use('/api/movies', movieRouter);
    app.use('/api/rentals', rentalRouter);
    app.use('/api/returns', returnRouter);
    app.use('/api/users', userRouter);
    app.use('/api/auth', authRouter);
    // Error Handling middleware
    app.use(error);
}