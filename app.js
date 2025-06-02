'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');

var app = express();

//LOAD ROUTES
const tokenRouter = require('./routes/token');
const usersRouter = require('./routes/users');
const loginRouter = require('./routes/login');
const productsRouter = require('./routes/products');

// MIDDLEWARES
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/api', tokenRouter);
app.use('/api', usersRouter);
app.use('/api', loginRouter);
app.use('/api', productsRouter);


// CORS
app.use((req, res, next) => {
   res.header('Access-Control-Allow-Origin', '*');
   res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
   res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
   res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');

   next();
});

module.exports = app;
