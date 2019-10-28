const express = require("express");
const app = express();
const { verificaToken, verificaRole } = require("../middleware/autenticacion");
const Categoria = require("../models/categoria");

app.get("/categoria", verificaToken, (req, res) => {

    Categoria.find({})
        .sort('descripcion')
        .populate('usuario', 'nombre email') // obtener los datos de usuario
        .exec((err, categoriaDB) => {
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
                categoriaDB
            });
        });
});

app.get("/categoria/:id", verificaToken, (req, res) => {
    // obtener el id
    let id = req.params.id;

    Categoria.findById(id, (err, categoriaDB) => {
        // si hay error interno
        if (err) {
            return res.status(500).json({
                Ok: false,
                err: 'error'
            });
        }

        // si hay error al crear la categoria
        if (!categoriaDB) {
            return res.status(400).json({
                Ok: false,
                err: {
                    message: 'Categoria no encontrada'
                }
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        })
    });
});

app.post("/categoria", verificaToken, (req, res) => {
    // recoger lo que viene del body
    let body = req.body;

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });

    categoria.save((err, categoriaDB) => {
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
            categoria: categoriaDB
        });
    });
});

app.put("/categoria/:id", verificaToken, (req, res) => {
    let id = req.params.id;
    let body = req.body;

    let descCategoria = {
        descripcion: body.descripcion
    };

    Categoria.findByIdAndUpdate(
        id,
        descCategoria, { new: true },
        (err, categoriaDB) => {
            console.log(categoriaDB);

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
                categoria: categoriaDB
            });
        }
    );
});

app.delete("/categoria/:id", [verificaToken, verificaRole], (req, res) => {
    // recoger el id que viene de los parametros
    let id = req.params.id;

    Categoria.findByIdAndRemove(id, (err, categoriaDB) => {
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
                err: {
                    message: "El id no existe"
                }
            });
        }

        // si todo esta bien, entonces procedo a borrar el registro
        res.json({
            ok: true,
            message: "Categoria borrada"
        });
    });
});

module.exports = {
    app
};