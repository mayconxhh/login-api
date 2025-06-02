'use strict'

const Product = require('../models/productModel');

async function NewProduct(req, res) {

    const product = req.body;

    if (!product || !product.title || !product.description || !product.price || !product.category || !product.instructor || !product.published || !product.imageUrl || !product.contentUrl) {
        return res.status(400).send({ message: 'Faltan datos del producto' });
    }

    let nuevoProducto = new Product(product);

    try {
        const productoGuardado = await nuevoProducto.save();
        return res.status(201).send({ message: 'Producto creado', producto: productoGuardado });
    } catch (err) {
        console.error('Error al crear el producto:', err);
        return res.status(500).send({ message: 'Error al crear el producto' });
    }
}

async function GetProduct(req, res) {
    try {
        const productos = await Product.find();
        return res.status(200).send({ productos });
    } catch (err) {
        console.error('Error al listar productos:', err);
        return res.status(500).send({ message: 'Error al listar productos' });
    }
}

module.exports = {
    NewProduct,
    GetProduct
};