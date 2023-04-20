const express = require('express')
const cookieParser = require('cookie-parser')
const app = express()


//handlebars
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');
const handlebars = require('express-handlebars');
const hbs = handlebars.create({
  handlebars: allowInsecurePrototypeAccess(require('handlebars')),
  defaultLayout: 'main'
});
//dataBase
const mongoConnect = require('../db')
//Router
const router = require('./routers')
//middleware para cookies
app.use(cookieParser());
// middleware para leer datos de formularios
app.use(express.urlencoded({ extended: true }));
// Servir archivos estáticos desde la carpeta "public"
app.use(express.static(__dirname + '/public'));
//middleware para leer datos de archivos json
app.use(express.json())
app.engine('handlebars', hbs.engine);
app.set('views',__dirname + '/views')


mongoConnect()
router(app)




module.exports = app
