const bcrypt = require('bcrypt')

const hashPassword = password => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10))
}

const isValidPassword = (password, user) => {
  return bcrypt.compareSync(password, user.password)
}

module.exports = {hashPassword, isValidPassword}