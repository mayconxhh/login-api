'use strict'

const SessionIdentifier = require('../models/sessionModel');

async function Login(req, res) {
    const sessionUid = req.headers['session-uid'];
    const cellphone = req.body['cellphone'];

    const user = req.user;

    try { 
        // Usa el modelo directamente, no una instancia
        let session = await SessionIdentifier.findOne({ sessionIdentifier: sessionUid, cellphone: cellphone });
        if (!session) {
            return res.status(404).send({ message: 'No se encontró la sesión' });
        }
        return res.status(200).send({
            message: 'Sesión encontrada exitosamente',
            user
        });
    } catch (err) {
        console.error('Error al buscar la sesión:', err);
        return res.status(500).send({ message: 'Error al buscar la sesión' });
    }
}

module.exports = {
    Login
};