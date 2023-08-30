require('express-async-errors');
const winston = require('winston');
require('winston-mongodb');
const error = require('./middleware/error')
const jwt = require('jsonwebtoken');
const config = require('config');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const mongoose = require('mongoose');
const express = require('express');
const app = express();
const genreRouter = require('./routes/genres');
const customerRouter = require('./routes/customers');
const movieRouter = require('./routes/movies');
const rentalRouter = require('./routes/rentals');
const userRouter = require('./routes/users');
const authRouter = require('./routes/auth');

// subscribe
// process.on('uncaughtException', (ex) => {
//     winston.error(ex.message, ex);
//     process.exit(1);
// });
//
// process.on('unhandledRejection', (ex) => {
//     winston.error(ex.message, ex);
//     process.exit(1);
// });

winston.handleExceptions(new winston.transports.File({ filename: 'uncaught.log' }));

winston.add(new winston.transports.File({ filename: 'logfile.log' }));
winston.add(
    new winston.transports.MongoDB({
        db: "mongodb://localhost/vidly",
        level: 'info'
    })
);

// throw new Error('something vague happening');
const p = Promise.reject(new Error('Something failed miserably'));
p.then(() => console.log('Done'));// ß.catch(() => console.log('Fail')); // no catch


if (!config.get('jwtPrivateKey')) {
    console.log('FATAL: jwt private key is not defined');
    process.exit(1);
}

mongoose.connect('mongodb://localhost/vidly')
    .then(() => console.log('Connected to MongoDB...'))
    .catch(err => console.error('Could not connect to MongoDB!', err));

// middleware
app.use(express.json());

// routers
app.use('/api/genres', genreRouter);
app.use('/api/customers', customerRouter);
app.use('/api/movies', movieRouter);
app.use('/api/rentals', rentalRouter);
app.use('/api/users', userRouter);
app.use('/api/auth', authRouter);
// Error Handling middleware
app.use(error);


const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`listening on port ${port}...`));
