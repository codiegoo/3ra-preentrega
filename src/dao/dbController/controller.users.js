const { Router } = require('express')
// const {usersCreate} = require('../dbDao/users.dao')
// const {hashPassword} = require('../../utils/cryptPassword.utils')
const passport = require('passport')

const router = Router()

router.post('/', passport.authenticate('register', { failureRedirect: 'register/failresgister' }), async (req, res) => {
  try {
    const newUser = req.user
    res.status(201).json({ status: 'success', message: newUser })
  } catch (error) {
    console.log(error.message)
    res.status(500).json({ status: 'error', error: 'Internal server error' })
  }
})

router.get('/', (req, res) => {
  try {
    res.render('register.handlebars')
  } catch (error) {
    res.status(400).json({error: error})
  }
})

router.get('/failregister', (req, res) => {
  console.log('falló estrategia de registro!')

  res.json({ error: 'Failed register' })
})
module.exports = router