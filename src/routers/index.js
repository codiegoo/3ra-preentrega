
const routerProducts = require('./routerProducts')
const routerRealTimeP = require('./routerRealTimeP')
const routerCarts = require('./routerCarts')

const router = app => {
  app.use('/api/products', routerProducts)
  app.use('/api/carts', routerCarts)
  app.use('/api/realTimeProducts', routerRealTimeP)
}

module.exports = router