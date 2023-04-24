
const mongoose = require('mongoose')

const collectionName = 'sessions'

const collectionSchema = new mongoose.Schema({
  first_name: String,
  last_name: String,
  email: {
    type: String,
    unique: true,
  },
  age: Number,
  password: String,
  role: {
    type: String,
    enum: ['administrador', 'usuario'],
    default: 'usuario',
  },
})

const Users = mongoose.model(collectionName, collectionSchema)

module.exports = Users