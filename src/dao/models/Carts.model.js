const mongoose = require('mongoose')

const collectionName = 'carts'

const collectionSchema = new mongoose.Schema({
  productos: [{
    product: {
      type: String,
      ref: 'Product'
    },
    quantity: {
      type: Number,
      default: 1
    }
  }]
})

const Cart = mongoose.model(collectionName, collectionSchema)
module.exports = Cart