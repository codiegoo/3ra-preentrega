const mongoose = require('mongoose');

const collectionName = 'messages'
const messageSchema = new mongoose.Schema({
  user: { type: String, required: true },
  message: { type: String, required: true }
});

const Message = mongoose.model(collectionName, messageSchema)
module.exports = Message