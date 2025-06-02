const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email:     { type: String, required: true, unique: true },
    cellphone: { type: Number, required: true, unique: true },
    clave:     { type: String, required: true }
});

module.exports = mongoose.model('User', userSchema);