const startupDebugger = require('debug')('app:startup');
const dbDebugger = require('debug')('app:db');
const config = require('config');
const helmet = require('helmet');
const morgan = require('morgan');
const Joi = require('joi');
const logger = require('./middleware/logger');
const courses = require('./routes/courses');
const defaultroute = require('./routes/default');
const authenticator = require('./authentication');
const express = require('express');
const app = express();

app.set('view engine', 'pug'); // geen expliciete require nodig
app.set('views', './views');   //default view dir

// some middleware
app.use(express.json());
app.use(logger);
app.use(authenticator);
app.use(helmet());

app.use('/api/courses', courses);
app.use('/', defaultroute);

console.log(config.get('name'));

if (app.get('env') === 'development') {
    app.use(morgan('tiny'));
    startupDebugger('Morgan enabled ...');
}

dbDebugger('connected to the Database ... ');

const port = process.env.PORT || 3000
app.listen(port, () => console.log(`listening on port ${port}...`));