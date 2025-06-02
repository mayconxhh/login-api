'use strict'

const express = require('express');
const { Token } = require('../controllers/tokenController');
const requireHeadersMiddleware = require('../middlewares/requestIdMiddleware');

const api = express.Router()

api
	.get('/token', requireHeadersMiddleware, Token );

module.exports = api;