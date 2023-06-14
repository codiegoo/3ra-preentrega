const app = require('./app')
const httpServer = require('http').createServer(app)
const socketIo = require('./socket')
const io = socketIo(httpServer)
const { port } = require('./config/app.config')


app.locals.io = io


//servidor Sockets
httpServer.listen(port, () => {
  console.log(`server running at port ${port}`)
})
