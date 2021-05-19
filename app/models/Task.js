const { model , Schema} = require('mongoose')

const newTaskSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  codebar: {
    type: String,
    required: true
  },
  price: {
    type: String,
    required: true
  },
})

module.exports = model('Task', newTaskSchema);