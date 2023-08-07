const express = require('express')
const cookieParser = require('cookie-parser')
const app = express()
const session = require('express-session')
const MongoStore = require('connect-mongo')
const mongoConnect = require('../db')
const router = require('./routers')
const passport = require('passport')
const initializePassport = require('./config/passport/passport.config')
const logger = require('./config/logs/logger.config')
const swaggerUiExpress = require('swagger-ui-express')
const swaggerJSDoc = require('swagger-jsdoc')





//middleware de logger de errores
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`)
  next()
})

//middleware para cookies
app.use(cookieParser());
// Middleware para leer archivos json
app.use(express.json())
// middleware para leer datos de formularios
app.use(express.urlencoded({ extended: true }));
// Servir archivos estáticos desde la carpeta "public"
app.use(express.static(__dirname + '/public'));
// Middleware de session
const {dbAdmin, dbPassword, dbName, dbHost, dbSecretKey} = require('./config/db.config')
app.use(
  session({
    store: MongoStore.create({
      mongoUrl:
        `mongodb+srv://${dbAdmin}:${dbPassword}@${dbHost}/${dbName}?retryWrites=true&w=majority`,
      mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
      collectionName: 'sessions'
    }),
    secret: `${dbSecretKey}`,
    resave: false,
    saveUninitialized: false
  })
);


//swagger documentate

const swaggerOptions = {
  definition: {
    openapi: '3.0.1',
    info: {
      title: "Documentacion to my project 💼",
      description: "Endpoints to Manager Products and carts in my ecommerce aplication."
    }
  },
  apis: [`${__dirname.replace(/\\/g, '/')}/docs/**/*.yaml`]
}

const swaggerSpecs = swaggerJSDoc(swaggerOptions)



app.use('/api-docs', swaggerUiExpress.serve, swaggerUiExpress.setup(swaggerSpecs))



//passport middleware
initializePassport()
app.use(passport.initialize())
app.use(passport.session())


//handlebars
const handlebars = require('express-handlebars');
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');
const hbs = handlebars.create({
  handlebars: allowInsecurePrototypeAccess(require('handlebars')),
  defaultLayout: 'main'
});
app.engine('handlebars', hbs.engine);
app.set('views',__dirname + '/views')


mongoConnect()
router(app)




module.exports = app
