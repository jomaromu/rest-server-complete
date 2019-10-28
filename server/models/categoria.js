const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

// esquema
let Schema = mongoose.Schema;

// esquema de categoria
let categoriaSchema = new Schema({
    descripcion: {
        type: String,
        required: [true, 'La descripción es necesaria'],
        unique: true
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: "Usuario"
    }
});

categoriaSchema.plugin(uniqueValidator, { message: '{PATH} debe ser única' });

module.exports = mongoose.model('Categoria', categoriaSchema);