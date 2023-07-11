require('dotenv').config()



module.exports = {
  port: process.env.PORT || 8080,
  dev_env: process.env.DEV_ENV || 'development',
  secret_key: process.env.SECRET_KEY || 'defaultSecretKey'
} 