const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    title:        { type: String, required: true },
    description:  { type: String, required: true },
    price:        { type: Number, required: true },
    category:     { type: String, required: true },
    imageUrl:     { type: String },
    contentUrl:   { type: String }, // URL al contenido digital (ej: video, pdf, etc)
    instructor:   { type: String, required: true },
    published:    { type: Boolean, default: false },
    createdAt:    { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', productSchema);