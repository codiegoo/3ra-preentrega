const {Router} = require('express')
const router = Router()
const logger = require('../../config/logger.config')

router.get('/', (req, res) => {
  logger.debug('Mensaje de prueba - Debug')
  logger.info('Mensaje de prueba - Info')
  logger.warning('Mensaje de prueba - Warning')
  logger.error('Mensaje de prueba - Error')

  res.send('Prueba de logs exitosa')
})

module.exports = router