'use strict'

const express = require('express');
const { UserNumberGenerate, UserAuthentication, newUser } = require('../controllers/userController');
const  { authMiddleware } = require('../middlewares/authMiddleware');
const requireHeadersMiddleware = require('../middlewares/requestIdMiddleware');

const api = express.Router()

api
	.get('/userAuth', authMiddleware, requireHeadersMiddleware, UserNumberGenerate )
	.post('/userAuth', authMiddleware, requireHeadersMiddleware, UserAuthentication)
	.post('/newUser', authMiddleware, requireHeadersMiddleware, newUser); 

module.exports = api;
