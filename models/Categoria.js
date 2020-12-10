const mongoose = require('mongoose');
const slugify = require('slugify');

const categoriaSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: [true, 'Debe ingresar Categoria'],
      enum: [
        'M-6',
        'M-7',
        'M-8',
        'M-9',
        'M-10',
        'M-11',
        'M-12',
        'M-13',
        'M-14',
        'M-15',
        'M-16',
        'M-17',
        'M-18',
        'M-19',
        'M-20',
        'Superior Masculino',
        'Superior Femenino',
        'Veteranos',
      ],
    },
    year: {
      type: Number,
      required: [true, 'Debe ingresar Año'],
    },
    socio: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Socio',
      },
    ],
    slug: String,
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

categoriaSchema.index({ nombre: 1, year: 1 }, { unique: true });

// DOCUMENT MIDDLEWARE. runs before .save()
categoriaSchema.pre('save', function (next) {
  const short = `${this.nombre} ${this.year}`;
  this.slug = slugify(short, { lower: true });
  next();
});

// divisionSchema.pre(/^find/, function (next) {
//   this.populate({
//     path: 'member',
//     select: 'nombre',
//   });
//   next();
// });

const Categoria = mongoose.model('Categoria', categoriaSchema);

module.exports = Categoria;
