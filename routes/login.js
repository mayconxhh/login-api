'use strict'

const express = require('express');
const { Login } = require('../controllers/loginController');
const  { secureAuthMiddleware } = require('../middlewares/authMiddleware');
const requireHeadersMiddleware = require('../middlewares/requestIdMiddleware');

const api = express.Router()

api
	.post('/login', secureAuthMiddleware, requireHeadersMiddleware, Login);

module.exports = api;