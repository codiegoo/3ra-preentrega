const { Router } = require('express')
const passport = require('passport')
const ErrorRepository = require('../repository/errors.repository')

const router = Router()

router.post('/', passport.authenticate('register', { failureRedirect: 'register/failresgister' }), async (req, res, next) => {
  try {
    const newUser = req.user
    res.status(201).json({ status: 'success', message: newUser })
  } catch (error) {
    console.log(error.message)
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
  console.log('falló estrategia de registro!')

  next(error)
})
module.exports = router