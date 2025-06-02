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

const express = require('express');
const { NewProduct, GetProduct } = require('../controllers/productController');
const { secureAuthMiddleware } = require('../middlewares/authMiddleware');
const requireHeadersMiddleware = require('../middlewares/requestIdMiddleware');
const userHeaderMiddleware = require('../middlewares/userHeaderMiddleware');

const api = express.Router()

api
	.post('/products', secureAuthMiddleware, requireHeadersMiddleware, userHeaderMiddleware, NewProduct)
	.get('/products', secureAuthMiddleware, requireHeadersMiddleware,userHeaderMiddleware, GetProduct);

module.exports = api;