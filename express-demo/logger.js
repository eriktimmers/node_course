const log = function(req, res, next) {
    console.log('Logging...');
    next();
}

module.exports = log;