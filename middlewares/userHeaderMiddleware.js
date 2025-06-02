'use strict';
/**
 * Middleware to check if the request contains a 'request-id' header.
 * If the header is missing, it responds with a 400 status code and an error message.
 * If the header is present, it calls the next middleware in the stack.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */

function userHeaderMiddleware(req, res, next) {
    const userBody = req.user;

    if (!userBody) {
        return res.status(400).send({ message: 'Sesion corrupta' });
    }
    next();
}

module.exports = userHeaderMiddleware;