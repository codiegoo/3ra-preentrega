const { Router } = require('express')
const Users = require('../models/Users.model')
const publicAccess = require('../../middlewares/publicAccess.middleware')

const router = Router()

router.get('/', (req, res) => {
  try {
    res.render('login.handlebars')
  } catch (error) {
    res.status(400).json({error: error})
  }
})



router.post('/', async (req, res, next) => {
  try {
    const { email, password } = req.body
    const user = await Users.findOne({ email })
    if (!user)
      return next('El usuario y la contraseña no coincide')

    if (user.password !== password)
      return next('El usuario y la contraseña no coincide')


    req.session.user = {
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      role: user.role
    }
    next()
  } catch (error) {
    console.log(error.message)
    res.status(500).json({ status: 'error', error: 'Internal Server Error' })
  }
}, publicAccess, (req, res) => {
  res.status(500).json({message: 'usuario no encontrado'})
})

router.get('/logout', (req, res) => {
  req.session.destroy(error => {
    if (error) return res.json({ error })
    res.redirect('/api/login')
  })
})

module.exports = router