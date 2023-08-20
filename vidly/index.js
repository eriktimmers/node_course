const error = require('middleware/error')
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

if (!config.get('jwtPrivateKey')) {
    console.log('FATAL: jwt private key is not defined');
    process.exit(1);
}
console.log(config.get('jwtPrivateKey'));

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
