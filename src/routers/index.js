const productsController = require('../dao/dbController/controller.products')
const cartController = require('../dao/dbController/controller.carts')
const userController = require('../dao/dbController/controller.users')
const authController = require('../dao/dbController/controller.auth')
const currentSession = require('../dao/dbController/controller.sessions')
const messagesController = require('../dao/dbController/controller.messages')
const loggerTest = require('../dao/dbController/constroller.loggerTest')
const ErrorRepository = require('../dao/repository/errors.repository')



const errorHandler = (err, req, res, next) => {
  if (err instanceof ErrorRepository) {
    const errorMessage = err.message || 'Error desconocido'
    res.status(err.code).json({ error: errorMessage });
  } else {
    console.error(err);
    res.status(500).json({ error: 'Ocurrió un error en el servidor.' });
  }
};

const router = app => {
  app.use('/api/register', userController)
  app.use('/api/login', authController)
  app.use('/api/dbProducts', productsController)
  app.use('/api/dbCarts', cartController)
  app.use('/api/sessions/current', currentSession)
  app.use('/api/messages', messagesController)
  app.use('/api/loggerTest', loggerTest)

  app.use(errorHandler)
}







module.exports = router