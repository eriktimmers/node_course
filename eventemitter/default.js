const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('index', { title: 'my Express App', message: 'Hello Wereld' });
});

module.exports = router;