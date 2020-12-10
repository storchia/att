const mongoose = require('mongoose');
const slugify = require('slugify');

// const Attendance = new mongoose.Schema({
//   date: {
//     type: Date,
//   },
//   status: {
//     type: String,
//     enum: ['Presente', 'Ausente', 'Tarde', 'SAF'],
//     //default: 'Presente',
//   },
// });

const socioSchema = new mongoose.Schema(
  {
    numerosocio: {
      type: Number,
      unique: true,
    },
    nombre: {
      type: String,
      required: [true, 'Debe ingresar nombre'],
      minlength: [3, 'Nombre debe tener por lo menos 3 letras'],
    },
    apellido: {
      type: String,
      required: [true, 'Debe ingresar nombre'],
      minlength: [3, 'Nombre debe tener por lo menos 3 letras'],
    },
    dni: {
      type: Number,
      unique: true,
      required: [true, 'Debe ingresar DNI'],
    },
    direccion: {
      type: String,
    },
    telefono: {
      type: Number,
    },
    email: String,
    dob: Date,
    presentismo: [
      {
        date: {
          type: Date,
        },
        status: {
          type: String,
          enum: ['Presente', 'Ausente', 'Tarde', 'SAF'],
          //default: 'Presente',
        },
      },
    ],
    slug: String,
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

socioSchema.index = { nombre: 1, presentismo: 1 };

// Virtual populate
socioSchema.virtual('cat', {
  ref: 'Categoria',
  localField: '_id',
  foreignField: 'socio',
  justOne: false,
  //options: { select: 'nombre year' },
});

socioSchema.pre('save', function (next) {
  this.slug = slugify(this.dni.toString());
  next();
});

const Socio = mongoose.model('Socio', socioSchema);

module.exports = Socio;
