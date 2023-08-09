const mongoose = require('mongoose');
const express = require('express');
const app = express();
const genreRouter = require('./routes/genres');

mongoose.connect('mongodb://localhost/vidly')
    .then(() => console.log('Connected to MongoDB...'))
    .catch(err => console.error('Could not connect to MongoDB!', err));

// middleware
app.use(express.json());

// routers
app.use('/api/genres', genreRouter);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`listening on port ${port}...`));
