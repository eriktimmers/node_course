const winston = require('winston');
const express = require('express');
const app = express();

require('./startup/logging')();
require('./startup/config')();
require('./startup/routes')(app);
require('./startup/mongodb')();
require('./startup/validation')();

const port = process.env.PORT || 3000;
const server = app.listen(port, () => winston.info(`listening on port ${port}...`));

module.exports = server;