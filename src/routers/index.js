
// const routerProducts = require('./routerProducts')
// const routerRealTimeP = require('./routerRealTimeP')
// const routerCarts = require('./routerCarts')
const productsController = require('../dao/dbController/controller.products')
const cartController = require('../dao/dbController/controller.carts')
const messageController = require('../dao/dbController/controller.messages')
const userController = require('../dao/dbController/controller.users')
const authController = require('../dao/dbController/controller.auth')

const router = app => {
  // app.use('/api/products', routerProducts)
  // app.use('/api/carts', routerCarts)
  // app.use('/api/realTimeProducts', routerRealTimeP)
  app.use('/api/register', userController)
  app.use('/api/login', authController)
  app.use('/api/dbProducts', productsController)
  app.use('/api/dbCarts', cartController)
  app.use('/api/messages', messageController)
}

module.exports = router