const { Router } = require('express')
const passport = require('passport')

const router = Router()

router.get('/', (req, res, next) => {
  try {
    res.render('login.handlebars')
  } catch (error) {
    next(error)
  }
})

router.post('/', passport.authenticate('login', { failureRedirect: 'login/faillogin' }),  async (req, res, next) => {
  try {
    if(!req.user){
      const error = error
      return next(error)
    }

    // Establecer una session con los datos del usuario autenticado
    req.session.user = {
      _id: req.user._id,
      first_name: req.user.first_name,
      last_name: req.user.last_name,
      email: req.user.email,
      role: req.user.role,
      cartId: req.user.cartId
    }
    res.status(200).json({ status: 'succes', message: 'sesion establecida'})
  } catch (error) {
    console.log(error.message)
    next(error)
  }
})

router.get('/logout', (req, res, next) => {
  req.session.destroy(error => {
    if (error) return next(error)
    res.redirect('/api/login')
  })
})

router.get('/github',passport.authenticate('github', { scope: ['user: email'] }),async (req, res) => {

}
)

router.get(
  '/githubcallback',
  passport.authenticate('github', { failureRedirect: 'login/faillogin' }),
  async (req, res) => {
    req.session.user = req.user
    res.redirect('/api/dbProducts?limit=9')
  }
)


router.get('/faillogin', (req, res, next) => {
  console.log('falló estrategia de autenticacion')
  next(error)
})
module.exports = router