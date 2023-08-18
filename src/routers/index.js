const productsController = require('../dao/dbController/controller.products')
const cartController = require('../dao/dbController/controller.carts')
const registerController = require('../dao/dbController/controller.register')
const authController = require('../dao/dbController/controller.auth')
const userController = require('../dao/dbController/controller.users')
const messagesController = require('../dao/dbController/controller.messages')
const loggerTest = require('../dao/dbController/controller.loggerTest')
const ErrorRepository = require('../dao/repository/errors.repository')
const adminPanel = require('../dao/dbController/controller.adminPanel')




const errorHandler = (err, req, res, next) => {
  if (err instanceof ErrorRepository) {
    const errorMessage = err.message || 'Error desconocido'
    res.status(err.code).json({ error: errorMessage });
  } else {
    console.error(err);
    res.status(500).json({ error: 'Ocurrió un error en el servidor.' })
  }
}





const router = app => {
  app.use('/api/register', registerController)
  app.use('/api/login', authController)
  app.use('/api/dbProducts', productsController)
  app.use('/api/dbCarts', cartController)
  app.use('/api/user', userController)
  app.use('/api/messages', messagesController)
  app.use('/api/loggerTest', loggerTest)
  app.use('/api/adminPanel', adminPanel)
  app.use(errorHandler)
}







module.exports = router