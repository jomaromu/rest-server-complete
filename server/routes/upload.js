const express = require("express");
const fileUpload = require("express-fileupload");
const app = express();
const Usuario = require("../models/usuario");
const Productos = require("../models/producto");

// controlar los path para verificar si las rutas donde voy a guardar las imagenes existe
const fs = require("fs");
const path = require("path");

// default options
app.use(fileUpload({ useTemFiles: true }));

app.put("/upload/:tipo/:id", (req, res) => {
    // enviar el producto a un tipo(usuario o producto) y el id que genera esta peticion
    let tipo = req.params.tipo;
    let id = req.params.id;

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            Ok: false,
            err: "No se ha seleccionado ningún archivo"
        });
    }

    // validar tipos
    let tiposValidos = ["productos", "usuarios"];

    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            message: "El tipo no está permitido"
        });
    }

    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    let archivo = req.files.nombreInput;

    // extensiones permitidas
    let extensionesValidas = ["png", "jpg", "gif", "jpeg"];

    let nombreCortado = archivo.name.split(".");
    let extension = nombreCortado[nombreCortado.length - 1];

    if (extensionesValidas.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            message: "Al parecer el archivo no es permitido: " +
                extensionesValidas.join(", ")
        });
    }

    // cambiar nombre al archivo
    let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extension}`;

    // Use the mv() method to place the file somewhere on your server
    archivo.mv(`../uploads/${tipo}/${nombreArchivo}`, err => {
        if (err)
            return res.status(500).json({
                ok: false,
                err
            });

        // aqui, imagen cargada
        if (tipo === "usuarios") {
            imagenUsuario(id, res, nombreArchivo);
        } else if (tipo === "productos") {
            imagenProducto(id, res, nombreArchivo);
        }
        // res.json({
        //     ok: true,
        //     message: "Imagen subida correctamente"
        // });
    });
});

function imagenUsuario(id, res, nombreArchivo) {
    Usuario.findById(id, (err, usuarioDB) => {
        // si hay un error interno
        if (err) {
            borraArchivo(nombreArchivo, "usuarios");
            return res.status(500).json({
                ok: false,
                err
            });
        }

        // si no existe el usuario en BD
        if (!usuarioDB) {
            borraArchivo(nombreArchivo, "usuarios");
            return res.status(400).json({
                ok: false,
                err: "No existe este usuario"
            });
        }

        // crear el path y borrar la ultima imagen
        // let pathImagen = path.resolve(
        //     __dirname,
        //     `../../uploads/usuarios/${usuarioDB.img}`
        // );
        // if (fs.existsSync(pathImagen)) {
        //     fs.unlinkSync(pathImagen);
        // }

        // crear el path y borrar la ultima imagen
        borraArchivo(usuarioDB.img, "usuarios");

        // actualizar el archivo en base de datos
        usuarioDB.img = nombreArchivo;

        usuarioDB.save((err, usuarioGuardado) => {
            res.json({
                ok: true,
                usuario: usuarioGuardado,
                img: nombreArchivo
            });
        });
    });
}

function imagenProducto(id, res, nombreArchivo) {
    Productos.findById(id, (err, productoDB) => {
        // si hay un error interno
        if (err) {
            // borraArchivo(nombreArchivo, "productos");
            return res.status(500).json({
                ok: false,
                err
            });
        }

        // si no existe el usuario en BD
        if (!productoDB) {
            // borraArchivo(nombreArchivo, "productos");
            return res.status(400).json({
                ok: false,
                err: "No existe este producto"
            });
        }

        // crear el path y borrar la ultima imagen
        borraArchivo(productoDB.img, "productos");

        // actualizar el archivo en base de datos
        productoDB.img = nombreArchivo;

        productoDB.save((err, productoGuardado) => {
            res.json({
                ok: true,
                producto: productoGuardado,
                img: nombreArchivo
            });
        });
    });
}

function borraArchivo(nombreImagen, tipo) {
    // crear el path y borrar la ultima imagen
    let pathImagen = path.resolve(
        __dirname,
        `../../uploads/${tipo}/${nombreImagen}`
    );
    if (fs.existsSync(pathImagen)) {
        fs.unlinkSync(pathImagen);
    }
}

module.exports = {
    app
};