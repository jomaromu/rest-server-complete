const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const _ = require('underscore'); // filtrar actualizaciones de datos
const Usuario = require('../models/usuario');

// get
app.get('/usuario', (req, res) => {

    // res.json('hello world local');

    let desde = req.query.desde || 0;
    let limite = req.query.limite || 5;

    desde = Number(desde);
    limite = parseInt(limite);

    Usuario.find({ estado: true }, 'role estado google nombre email') // barrer todos los registros
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {

            if (err) {
                return res.status(400).json({
                    Ok: false,
                    err
                });
            }

            // conteo de los registros
            Usuario.count({ estado: true }, (err, conteo) => {

                res.json({
                    Ok: true,
                    usuarios,
                    cuantos: conteo
                });
            });

        });
});

// post
app.post('/usuario', (req, res) => {

    let body = req.body;

    // creando mi usuario basado en el esquema mongoose
    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        // img: body.img,
        role: body.role
    });

    // grabar en la base de datos
    usuario.save((err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                Ok: false,
                err
            });
        }

        res.json({
            Ok: true,
            usuario: usuarioDB
        });
    });
});

// put
app.put('/usuario/:id', (req, res) => {

    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']); // elementos que se pueden actualizar

    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                Ok: false,
                err
            });
        }

        res.json({
            Ok: true,
            usuario: usuarioDB
        });
    });

});

app.delete('/usuario/:id', (req, res) => {

    let id = req.params.id;
    let body = _.pick(req.body, ['estado']); // elementos que se pueden actualizar

    Usuario.findByIdAndUpdate(id, { estado: false }, { new: true, runValidators: true }, (err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                Ok: false,
                err
            });
        }

        res.json({
            Ok: true,
            usuario: usuarioDB
        });
    });

    // Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {

    //     // si algo sale mal al tratar de borrar un usuario
    //     if (err) {
    //         return res.status(400).json({
    //             Ok: false,
    //             err
    //         });
    //     }

    //     // si el usuario no existe
    //     if (!usuarioBorrado) {
    //         return res.status(400).json({
    //             Ok: false,
    //             err: 'El usuario no existe'
    //         });
    //     }

    //     res.json({
    //         Ok: true,
    //         usuarioBorrado
    //     });
    // });

});

module.exports = {

    app
};