const {Router} = require('express')
const router = Router()
const Message = require('../../models/Messages.model')
const userAcces = require('../../middlewares/userAcces.middleware')

router.get('/', userAcces, async (req, res, next) => {
  try {
    const messages = await Message.find().lean()
    const userEmail = req.user.email
    res.render('messages.handlebars', { messages, userEmail });
  } catch (error) {
    console.error(error)
    next(error)
  }
});

module.exports = router