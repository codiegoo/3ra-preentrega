const express = require('express')
const cookieParser = require('cookie-parser')
const app = express()
const session = require('express-session')
const MongoStore = require('connect-mongo')
//dataBase
const mongoConnect = require('../db')
//Router
const router = require('./routers')


//handlebars
const handlebars = require('express-handlebars');
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');
const hbs = handlebars.create({
  handlebars: allowInsecurePrototypeAccess(require('handlebars')),
  defaultLayout: 'main'
});
//middleware para cookies
app.use(cookieParser());
// middleware para leer datos de formularios
app.use(express.urlencoded({ extended: true }));
// Servir archivos estáticos desde la carpeta "public"
app.use(express.static(__dirname + '/public'));
app.use(
  session({
    store: MongoStore.create({
      mongoUrl:
        'mongodb+srv://codiego:tjmeSYuznFqFBDuF@clustercodiego.bwl42a0.mongodb.net/Ecommerce?retryWrites=true&w=majority',
      mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
    }),
    secret: 'coderSecret',
    resave: false,
    saveUninitialized: false
  })
);





app.use(express.json())
app.engine('handlebars', hbs.engine);
app.set('views',__dirname + '/views')


mongoConnect()
router(app)




module.exports = app
