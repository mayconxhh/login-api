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

function requireHeadersMiddleware(req, res, next) {
    const requestId = req.headers['request-id'];
    const contentType = req.headers['content-type'];
    const accept = req.headers['accept'];
    const userAgent = req.headers['user-agent'];
    const acceptLanguage = req.headers['accept-language'];

    if (!requestId || requestId.length !== 36) {
        return res.status(400).send({ message: 'Cabecera request-id inválido o no proporcionado' });
    }

    if (!contentType || contentType !== 'application/json') {
        return res.status(400).send({ message: 'Cabecera Content-Type inválido o no proporcionado' });
    }

    if (!accept || accept !== 'application/json') {
        return res.status(400).send({ message: 'Cabecera Accept inválido o no proporcionado' });
    }

    if (!userAgent || userAgent !== 'LoginApp/1.0') {
        return res.status(400).send({ message: 'Cabecera User-Agent inválido o no proporcionado' });
    }

    if (!acceptLanguage || acceptLanguage !== 'es-PE') {
        return res.status(400).send({ message: 'Cabecera Accept-Language inválido o no proporcionado' });
    }

    res.set('request-id', requestId);
    res.set('Content-Type', contentType);
    res.set('Accept', accept);
    res.set('User-Agent', userAgent);
    res.set('Accept-Language', acceptLanguage);
    next();
}

module.exports = requireHeadersMiddleware;