'use strict'

require('dotenv').config();
const mongoose = require('mongoose');

const app = require('./app');
const port = process.env.PORT;
const mongoConnect = process.env.MONGODB_URI;

//CONECTION DATABASE
mongoose.Promise = global.Promise;
mongoose.connect(mongoConnect)
	.then(()=>{
		console.log('Conexión con base de datos se a realizado con éxito');

		// CONECTION SERVER
		app.listen(port, () =>{
			console.log(`Servidor corriendo en el puerto:${port}`);
		});

	}, err =>{
		console.log(err);
	});