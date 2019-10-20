const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');


app.post('/login', (req, res) => {

    // obtener el body
    let body = req.body;

    Usuario.findOne({ email: body.email }, (err, UsuarioDB) => {

        // verifico si hay un error interno del servidor
        if (err) {
            return res.status(500).json({
                Ok: false,
                err
            });
        }

        // verifico si el email no existe o si el usuario no existe en base de datos
        if (!UsuarioDB) {
            return res.status(400).json({
                Ok: false,
                message: '(Usuario) o contraseña incorrectos'
            });
        }

        // evaluo si la contraseña es correcta
        if (!bcrypt.compareSync(body.password, UsuarioDB.password)) {

            return res.status(400).json({
                Ok: false,
                message: 'Usuario o (contraseña) incorrectos'
            });
        }

        // generar el token
        token = jwt.sign({

            usuario: UsuarioDB
        }, 'este-es-el-seed-desarrollo', { expiresIn: 60 * 60 * 24 * 30 });

        // regreso el usuario
        res.json({
            Ok: true,
            usuario: UsuarioDB,
            token
        });
    });
});


module.exports = {
    app
}