const express = require('express')
const app = express()

//handlebars
const handlebars = require('express-handlebars')
//dataBase
const mongoConnect = require('../db')
//Router
const router = require('./routers')

// middleware para leer datos de formularios
app.use(express.urlencoded({ extended: true }));
// Servir archivos estáticos desde la carpeta "public"
app.use(express.static(__dirname + '/public'));
//middleware para leer datos de archivos json
app.use(express.json())
app.engine('handlebars', handlebars.engine())
app.set('views',__dirname + '/views')


mongoConnect()
router(app)




module.exports = app
