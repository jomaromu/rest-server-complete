require('./config/config');
// const rutas = require('./routes/usuario')
const rutas = require('./routes/rutas');

const express = require('express');
const mongoose = require('mongoose');
const app = express();

// recibir los headers y pasarlos a json
const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// llamar a las rutas
app.use(rutas.app);

// usando mongoose
mongoose.connect(process.env.URLDB, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true }, (err, res) => {

    if (err) throw err;
    console.log('Base de datos online');
});

app.listen(process.env.PORT, () => {

    console.log(`escuchando puerto: ${process.env.PORT}`);
});