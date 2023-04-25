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
    // Recopilar y verificar la informacion del usuario
    const { email, password } = req.body
    const user = await Users.findOne({ email })
    if (!user)
      return next('El usuario y la contraseña no coincide')

    if (user.password !== password)
      return next('El usuario y la contraseña no coincide')

    // Establecer una session con los datos del usuario autenticado
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



  // Aqui utilizo el middleware despues de establecer la session para que esta contenga los datos del usuaario, si la pusiera al inicio esta no se ejecutaria por que no hay una session iniciada
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