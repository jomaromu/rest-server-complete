const express = require("express");
const fs = require("fs");
const app = express();
const path = require("path");
const { verificaTokenImg } = require('../middleware/autenticacion');

app.get("/imagen/:tipo/:img", verificaTokenImg, (req, res) => {
    let tipo = req.params.tipo;
    let img = req.params.img;

    // path de la imagen que quiero mostrar
    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${img}`);

    // path de la imagen por defecto
    let noImagePath = path.resolve(__dirname, "../assets/no-image.jpg");

    if (fs.existsSync(pathImagen)) {
        res.sendFile(pathImagen);
    } else {
        res.sendFile(noImagePath);
    }
});

module.exports = {
    app
};