const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
    sessionIdentifier: { type: String, required: true, unique: true },
    cellphone:         { type: Number, required: true }
});

module.exports = mongoose.model('Session', sessionSchema);