'use strict'

const { createToken } = require('../services/jwt');

function Token(req, res) {
    const params = req.body;

    let token = createToken();

    return res.status(200).send({
        message: 'Token generated successfully',
        token: token
    });
}

module.exports = {
	Token
};