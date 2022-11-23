const { model , Schema} = require('mongoose')

const newJornadaSchema = new Schema({
  ventas: {
    type: Array,
    required: true
  },
  horario: {
    type: Date,
    required: true
  },
  caja: {
    type: String,
    required: true
  },
  total: {
    type: String,
    required: true
  }
})

module.exports = model('Jornada', newJornadaSchema);