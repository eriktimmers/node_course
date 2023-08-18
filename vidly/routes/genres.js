const {Genre, genreSchema, validate} = require('../models/genre');
const mongoose = require('mongoose');
const express = require('express');

const router = express.Router();

router.get('/', async (req, res) => {
    const genre = await Genre.find().sort('name');
    if (!genre) return res.status(404).send('Genre not Found.');
    res.send(genre);
});

router.get('/:id', async (req, res) => {
    const genre = await Genre.findById(req.params.id);
    console.log(genre);

    if (!genre) return res.status(404).send('No Genres found.');
    res.send(genre);
});

router.post('/', async (req, res) => {
    console.log(req.body);
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    let genre = new Genre({
        name: req.body.name
    });

    genre = await genre.save();

    res.send(genre);
});

router.put('/:id', async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let genre = await Genre.findById(req.params.id)
    if (!genre) return res.status(404).send('Genre not Found.');

    genre.name = req.body.name;
    const result = await genre.save();
    console.log(result);

    res.send(genre);
});

router.delete('/:id', async (req, res) => {
    const genre = await Genre.findByIdAndRemove(req.params.id);
    if (!genre) return res.status(404).send('Genre not Found.');
    res.send(genre);
});

module.exports = router;