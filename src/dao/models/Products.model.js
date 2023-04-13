const mongoose = require('mongoose')

const collectionName = 'products'

const collectionSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  stock: Number,
  code: String,
  category: String,
  status: Boolean,
  img: String
})

const Products = mongoose.model(collectionName, collectionSchema)
module.exports = Products