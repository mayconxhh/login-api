const mongoose = require('mongoose');

const KeyboardGenerateSchema = new mongoose.Schema({
    seed: { type: String, required: true },
    keyboard: [
        {
            number: { type: Number, required: true },
            value: { type: String, required: true },
            _id: false
        },
        {
            number: { type: Number, required: true },
            value: { type: String, required: true },
            _id: false
        },
        {
            number: { type: Number, required: true },
            value: { type: String, required: true },
            _id: false
        },
        {
            number: { type: Number, required: true },
            value: { type: String, required: true },
            _id: false
        },
        {
            number: { type: Number, required: true },
            value: { type: String, required: true },
            _id: false
        },
        {
            number: { type: Number, required: true },
            value: { type: String, required: true },
            _id: false
        },
        {
            number: { type: Number, required: true },
            value: { type: String, required: true },
            _id: false
        },
        {
            number: { type: Number, required: true },
            value: { type: String, required: true },
            _id: false
        },
        {
            number: { type: Number, required: true },
            value: { type: String, required: true },
            _id: false
        },
        {
            number: { type: Number, required: true },
            value: { type: String, required: true },
            _id: false
        }
    ]
});

module.exports = mongoose.model('KeyboardGenerate', KeyboardGenerateSchema);