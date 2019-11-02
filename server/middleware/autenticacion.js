const jwt = require("jsonwebtoken");

// verificar token img
let verificaTokenImg = (req, res, next) => {
    let token = req.query.token; // query es el paramentro url y token es el nombre del param.
    // verificar token
    jwt.verify(token, process.env.SEED, (err, decoded) => {
        // si hay un error
        if (err) {
            return res.status(401).json({
                Ok: false,
                err
            });
        }

        // console.log(decoded);

        // si todo es correcto
        req.usuario = decoded.usuario; // este es el usuario que viene en el token decodificado
        // console.log(req.usuario);
        next();
    });
};

// verificar token
let verificaToken = (req, res, next) => {
    let token = req.get("token");

    // verificar token
    jwt.verify(token, process.env.SEED, (err, decoded) => {
        // si hay un error
        if (err) {
            return res.status(401).json({
                Ok: false,
                err
            });
        }

        // console.log(decoded);

        // si todo es correcto
        req.usuario = decoded.usuario; // este es el usuario que viene en el token decodificado
        // console.log(req.usuario);
        next();
    });
};

// verificar role
let verificaRole = (req, res, next) => {
    let usuario = req.usuario;

    console.log(usuario);

    if (usuario.role !== "ADMIN_ROLE") {
        return res.json({
            Ok: false,
            err: {
                message: "El usuario no es administrador"
            }
        });
    } else {
        next();
    }
};

module.exports = {
    verificaToken,
    verificaRole,
    verificaTokenImg
};