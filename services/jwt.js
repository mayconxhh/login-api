'use strict'

require('dotenv').config();
const jwt = require('jsonwebtoken');
const moment = require('moment');
const jwtSecret = process.env.JWT_SECRET;

function createToken (payload = {}){
	// Puedes agregar más datos al payload si lo necesitas
    payload.iat = moment().unix();
    payload.date = "Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit..."

    // Si usas jsonwebtoken:
    return jwt.sign(payload, jwtSecret, { algorithm: 'HS512', expiresIn: '5m' });
}

function verifyToken(token) {
    try {
        const decoded = jwt.verify(token, jwtSecret);
        return { valid: true, decoded };
    } catch (err) {
        return { valid: false, message: 'Token inválido o vencido' };
    }
}

function createTokenSession(payload = {}) {
    payload.iat = moment().unix();
    payload.date = "Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...";

    return jwt.sign(payload, jwtSecret, { algorithm: 'HS512', expiresIn: '5m' });
}

module.exports = {
    createToken,
    verifyToken,
    createTokenSession
};