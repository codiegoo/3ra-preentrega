const {Router} = require('express')
const router = Router()

const passport = require('passport')


router.get('/', (req, res) => {
  try {
    if (req.session && req.session.user) {
      const session = req.session
      return res.status(200).json(session)
    }
      return res.json({message: 'Usuario no autenticado, por favor inicia sesion o registrate.'})
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' })
  }
})

module.exports = router