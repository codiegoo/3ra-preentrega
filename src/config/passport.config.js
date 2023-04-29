const passport = require('passport')
const local = require('passport-local')
const Users = require('../dao/models/Users.model')
const GithubStrategy = require('passport-github2')
const { hashPassword } = require('../utils/cryptPassword.utils')
const { isValidPassword } = require('../utils/cryptPassword.utils')
const { usersCreate } = require('../dao/dbDao/users.dao')

const LocalStrategy = local.Strategy

const initializePassport = () => {
	passport.use(
    'register',
    new LocalStrategy(
      { passReqToCallback: true, usernameField: 'email' },
      async (req, username, password, done) => {
        try {
          const {first_name,last_name,email,age,password} = req.body
          const user = await Users.findOne({ email: username })
          if (user) {
            console.log('Usuario ya existe')
            return done(null, false)
          }

          const hashedPassword = hashPassword(password) // hashear la contraseña
          const userInfo = {
            first_name,
            last_name,
            email,
            age,
            password: hashedPassword
          }

          const newUser = await usersCreate(userInfo)

          done(null, newUser)
        } catch (error) {
          done(error)
        }
      }
    )
  )

  passport.use(
    'login',
    new LocalStrategy(
      { usernameField: 'email' },
      async (username, password, done) => {
        try {
          const user = await Users.findOne({ email: username })
          if (!user)
            return done(null, false)
          // Verificar si la contraseña ingresada coincide con la contraseña almacenada en la base de datos
          if (!isValidPassword(password, user)) {
            return done(null, false)
          }
          done(null, user)
        } catch (error) {
          done(error)
        }
      }
    )
  )

  passport.use(
    'github',
    new GithubStrategy(
      {
        clientID: '3c012fc88f2816c327f1',
        clientSecret: '470401423f2d5b5199f49869f32111d16183cd07',
        callbackURL: 'http://localhost:8080/api/login/githubcallback',
      },
      async ( profile, done) => {
        try {
          console.log(profile)

          const user = await Users.findOne({ email: profile._json.email })

          if (!user) {
            const newUserInfo = {
              first_name: profile._json.name,
              last_name: '',
              age: 18,
              email: profile._json.email,
              password: '',
            }
            const newUser = await Users.create(newUserInfo)
            return done(null, newUser)
          }

          done(null, user)
        } catch (error) {
          done(error)
        }
      }
    )
  )

  passport.serializeUser((user, done) => {
    done(null, user.id)
  })

  passport.deserializeUser(async (id, done) => {
    const user = await Users.findById(id)
    done(null, user)
  })
}

module.exports = initializePassport