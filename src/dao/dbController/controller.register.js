const { Router } = require('express')
const passport = require('passport')
const logger = require('../../config/logs/logger.config')


const router = Router()


router.post('/', passport.authenticate('register', { failureRedirect: 'register/failresgister' }), async (req, res, next) => {
  try {
    const newUser = req.user

    logger.info('Se registro un nuevo usuario', newUser)
    res.status(201).json({ status: 'success', message: newUser })
  } catch (error) {
    logger.error('Error al crer usuario', error)
    next(error)
  }
})


router.get('/', (req, res, next) => {
  try {
    res.render('register.handlebars')
  } catch (error) {
    next(error)
  }
})


router.get('/failregister', (req, res, next) => {
  logger.error('Fallo en la estrategia de registro', error)

  next(error)
})


module.exports = router