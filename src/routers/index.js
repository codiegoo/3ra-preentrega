const productsController = require('../dao/dbController/controller.products')
const cartController = require('../dao/dbController/controller.carts')
const userController = require('../dao/dbController/controller.users')
const authController = require('../dao/dbController/controller.auth')
const currentSession = require('../dao/dbController/controller.sessions')

const router = app => {
  app.use('/api/register', userController)
  app.use('/api/login', authController)
  app.use('/api/dbProducts', productsController)
  app.use('/api/dbCarts', cartController)
  app.use('/api/sessions/current', currentSession)
}

module.exports = router