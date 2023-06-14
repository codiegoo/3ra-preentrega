const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')

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

collectionSchema.plugin(mongoosePaginate)

const Products = mongoose.model(collectionName, collectionSchema)
module.exports = Products