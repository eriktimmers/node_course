const winston = require('winston');
require('winston-mongodb');
require('express-async-errors');

module.exports = function() {

    winston.exceptions.handle(
        new winston.transports.Console({ }),
        new winston.transports.File({ filename: 'uncaught.log' })
    );

    winston.add(new winston.transports.File({
            filename: 'logfile.log',
            level: 'error'
        })
    );
    winston.add(
        new winston.transports.Console({
            level: 'info'
        })
    );
    winston.add(
        new winston.transports.MongoDB({
            db: "mongodb://localhost/vidly",
            level: 'error'
        })
    );
}