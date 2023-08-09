const mongoose = require('mongoose');
const Joi = require('joi');
const express = require('express');

const router = express.Router();

const Genre = mongoose.model('Genre', new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50,
        trim: true
    }
})); 

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
    const { error } = validateGenre(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    let genre = new Genre({
        name: req.body.name
    });

    genre = await genre.save();

    res.send(genre);
});

router.put('/:id', async (req, res) => {
    const { error } = validateGenre(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const genre = await Genre.findById(req.params.id)
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

function validateGenre(genre) {
    const Schema = Joi.object({
        name: Joi.string().min(2).required(),
    })
    return result = Schema.validate(genre);
}

module.exports = router;