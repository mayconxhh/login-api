'use strict';

const { verifyToken, verifySecureToken } = require('../services/jwt');
const { sessionUidIsValid } = require('../services/bcrypt');
const SessionIdentifier = require('../models/sessionModel');

function authMiddleware(req, res, next) {

    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).send({ message: 'Cabecera de autenticación Bearer requerida' });
    }
    const token = authHeader.split(' ')[1];
    const result = verifyToken(token);
    if (!result.valid) {
        return res.status(401).send({ message: result.message });
    }
    
    next();
}

async function secureAuthMiddleware(req, res, next) {
    const authHeader = req.headers['authorization'];
    const sessionUid = req.headers['session-uid'];
    const sessionUidRegex = /^\d{13,}-[a-fA-F0-9]{16}$/;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).send({ message: 'Cabecera de autenticación Bearer requerida' });
    }

    if (!sessionUid || !sessionUidRegex.test(sessionUid)) {
        await eliminarSesion(sessionUid); // Elimina la sesión si hay error
        return res.status(401).send({ message: 'Session UID inválido o no proporcionado' });
    }

    const token = authHeader.split(' ')[1];

    const getToken = verifyToken(token);
    if (!getToken.valid) {
        await eliminarSesion(sessionUid); // Elimina la sesión si hay error
        return res.status(401).send({ message: getToken.message });
    }

    if (!sessionUidIsValid(sessionUid)) {
        await eliminarSesion(sessionUid); // Elimina la sesión si hay error
        return res.status(401).send({ message: 'Session UID expirado' });
    }

    req.user = {
        cellphone: getToken.decoded.cellphone,
        email: getToken.decoded.email,
    };

    res.set('session-uid', sessionUid);
    next();
}

async function eliminarSesion(sessionIdentifier) {
    try {
        await SessionIdentifier.deleteOne({ sessionIdentifier });
    } catch (err) {
        console.error('Error al eliminar la sesión:', err);
    }
}

module.exports = {
    authMiddleware,
    secureAuthMiddleware
};