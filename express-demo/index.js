const startupDebugger = require('debug')('app:startup');
const dbDebugger = require('debug')('app:db');
const config = require('config');
const helmet = require('helmet');
const morgan = require('morgan');
const Joi = require('joi');
const logger = require('./logger');
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

console.log(config.get('name'));

if (app.get('env') === 'development') {
    app.use(morgan('tiny'));
    // console.log('Morgan enabled ...');
    startupDebugger('Morgan enabled ...');
}

dbDebugger('connected to the Database ... ');

const courses = [
    { id: 1, name: 'cursus 1'}, 
    { id: 2, name: 'Marx voor beginners en Engels voor gevorderden.'},
    { id: 3, name: 'Omgaan met teleurstellingen'},
];

app.get('/', (req, res) => {
    res.render('index', { title: 'my Express App', message: 'Hello' });
});

app.get('/api/courses', (req, res) => {
    res.send(courses);
});

app.get('/api/courses/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) res.status(404).send('Course not Found.');
    res.send(course);
});

app.post('/api/courses', (req, res) => {
    const { error } = validateCourse(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const course = {
        id: courses.length + 1,
        name: req.body.name
    };
    courses.push(course);
    res.send(course);
});

app.put('/api/courses/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) return res.status(404).send('Course not Found.');

   const { error } = validateCourse(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    course["name"] = req.body.name;
    res.send(course);
});

app.delete('/api/courses/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) return res.status(404).send('Course not Found.');

    const index = courses.indexOf(course);
    courses.splice(index, 1);

    res.send(course);
})

function validateCourse(course) {
    const Schema = Joi.object({
        name: Joi.string().min(3).required()
    })
    return result = Schema.validate(course);
}

const port = process.env.PORT || 3000
app.listen(port, () => console.log(`listening on port ${port}...`));