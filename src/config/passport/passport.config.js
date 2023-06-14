const passport = require('passport')
const local = require('passport-local')
const Users = require('../../models/Users.model')
const GithubStrategy = require('passport-github2')
const { hashPassword } = require('../../utils/cryptPassword.utils')
const { isValidPassword } = require('../../utils/cryptPassword.utils')
const usersCreate = require('../../dao/users.dao')

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
        clientID: 'Iv1.fd7a412bc2d3d8ea',
        clientSecret: 'a4bf21404e0482847624a410a84d97b34715416f',
        callbackURL: 'http://localhost:8080/api/login/githubcallback',
      },
      async ( accessToken, refreshToken,profile, done) => {
        try {
          const user = await Users.findOne({ email: profile._json.email })
          if(!user){
            const userInfo = {
              first_name: profile._json.name,
              last_name: '',
              age: 18,
              email: profile._json.email,
              password: '',
            }
            const newUser = await usersCreate(userInfo)
            return done(null, newUser)
          }
          done(null, user)
        } catch (error) {
          done(error)
        }
      }
    )
  )

  passport.serializeUser((newUser, done) => {
    const userId = newUser.id
    done(null, userId)
  })

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await Users.findById(id)
      done(null, user)
    } catch (error) {
      console.error(error)
    }
  })

}
module.exports = initializePassport