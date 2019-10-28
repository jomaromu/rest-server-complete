const express = require('express');
const app = express();
const { verificaToken } = require('../middleware/autenticacion');
const Producto = require('../models/producto');

app.get('/productos', verificaToken, (req, res) => {

    let desde = req.query.desde || 0;
    let limite = req.query.limite || 15;

    desde = Number(desde);
    limite = parseInt(limite);

    Producto.find({ disponible: true })
        .skip(desde)
        .limit(limite)
        .sort('descripcion')
        .populate('usuario', 'nombre, email') // obtener los datos de usuario
        .populate('categoria', 'descripcion') // obtener los datos de usuario
        .exec((err, productoDB) => {
            // si hay error interno
            if (err) {
                return res.status(500).json({
                    Ok: false,
                    err
                });
            }

            // si hay error al crear la categoria
            if (err) {
                return res.status(400).json({
                    Ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                productoDB
            });
        });
});

app.get('/productos/:id', verificaToken, (req, res) => {

    // obtengo el id
    let id = req.params.id;

    Producto.findById(id)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productoDB) => {

            // si hay error interno
            if (err) {
                return res.status(500).json({
                    Ok: false,
                    err
                });
            }

            // si hay error al crear la categoria
            if (err) {
                return res.status(400).json({
                    Ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                productoDB
            });
        });
});

// busqueda con parametros personalizados
app.get('/productos/buscar/:termino', verificaToken, (req, res) => {

    let termino = req.params.termino;
    let regExp = new RegExp(termino, 'i');

    Producto.find({ nombre: regExp })
        .populate('categoria', 'nombre')
        .exec((err, productoDB) => {

            // si hay error interno
            if (err) {
                return res.status(500).json({
                    Ok: false,
                    err
                });
            }

            // si hay error al buscar un producto
            if (err) {
                return res.status(400).json({
                    Ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                productoDB
            })
        });
});

app.post('/productos', verificaToken, (req, res) => {

    // recoger lo que viene del body
    let body = req.body;

    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        usuario: req.usuario._id,
        categoria: body.categoria
    })

    // si no hay error en base de datos
    producto.save((err, productoDB) => {

        // si hay error interno
        if (err) {
            return res.status(500).json({
                Ok: false,
                err
            });
        }

        // si hay error al crear el producto
        if (err) {
            return res.status(400).json({
                Ok: false,
                err
            });
        }

        // si todo va bien
        res.status(201).json({
            Ok: true,
            producto: productoDB
        });
    });
});

app.put('/productos/:id', verificaToken, (req, res) => {

    // recojo el id
    let id = req.params.id;
    // recojo todo lo que viene del body
    let body = req.body;

    // valores que voy a actualizar
    let actualizaProducto = {
        precioUni: 10.15
    }

    Producto.findById(id, (err, productoDB) => {

        // si hay error interno
        if (err) {
            return res.status(500).json({
                Ok: false,
                err
            });
        }

        // si hay error al crear la categoria
        if (!productoDB) {
            return res.status(400).json({
                Ok: false,
                err: {
                    message: 'El ID no existe'
                }
            });
        }

        productoDB.nombre = body.nombre;
        productoDB.precioUni = body.precioUni;
        productoDB.categoria = body.categoria;
        productoDB.disponible = body.disponible;
        productoDB.descripcion = body.descripcion;

        productoDB.save((err, productoDB) => {

            // si hay error interno
            if (err) {
                return res.status(500).json({
                    Ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                productoDB
            });

        });
    });
});

app.delete('/productos/:id', verificaToken, (req, res) => {

    // obtener el id
    let id = req.params.id;

    Producto.findById(id, (err, productoDB) => {

        // si hay error interno
        if (err) {
            return res.status(500).json({
                Ok: false,
                err
            });
        }

        // si hay error al crear el producto
        if (!productoDB) {
            return res.status(400).json({
                Ok: false,
                err: {
                    message: 'El ID no existe'
                }
            });
        }

        if (productoDB.disponible == false) {
            return res.json({
                alerta: 'Este producto ya esta deshabilitado'
            })
        } else {
            productoDB.disponible = false
        }

        productoDB.save((err, productoDB) => {

            // si hay error interno
            if (err) {
                return res.status(500).json({
                    Ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                productoDB,
                message: 'El estado del producto cambio a falso'
            })
        })
    });
});


module.exports = {
    app
}