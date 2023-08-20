const admin = require('../middleware/admin');
const auth = require('../middleware/auth');
const {Genre, genreSchema, validate} = require('../models/genre');
const mongoose = require('mongoose');
const express = require('express');

const router = express.Router();

router.get('/', async (req, res, next) => {
    try {
        const genre = await Genre.find().sort('name');
        if (!genre) return res.status(404).send('Genre not Found.');
        res.send(genre);
    }
    catch (ex) {
        next(ex);
    }
});

router.get('/:id', async (req, res, next) => {
    try {
        const genre = await Genre.findById(req.params.id);
        if (!genre) return res.status(404).send('No Genres found.');
        res.send(genre);
    }
    catch (ex) {
        next(ex);
    }
});

router.post('/', auth, async (req, res) => {
    console.log(req.body);
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    let genre = new Genre({
        name: req.body.name
    });

    genre = await genre.save();

    res.send(genre);
});

router.put('/:id', auth, async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let genre = await Genre.findById(req.params.id)
    if (!genre) return res.status(404).send('Genre not Found.');

    genre.name = req.body.name;
    const result = await genre.save();
    console.log(result);

    res.send(genre);
});

router.delete('/:id', [auth, admin], async (req, res) => {
    const genre = await Genre.findByIdAndRemove(req.params.id);
    if (!genre) return res.status(404).send('Genre not Found.');
    res.send(genre);
});

module.exports = router;