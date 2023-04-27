const {Router} = require('express')
const router = Router()
const Message = require('../models/Messages.model')

router.get('/', async (req, res) => {
  const messages = await Message.find().lean();
  res.render('chat.handlebars', { messages });
});

module.exports = router