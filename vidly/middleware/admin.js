module.exports = function (req, res, next) {
    if (!req.user.isAdmin) return res.status(403).send('User is not allowed to perform this action');

    next();
}