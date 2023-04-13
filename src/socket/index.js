const socketIo = require('socket.io')

const initSocketServer = httpServer => {
  const io = socketIo(httpServer)


  io.on('connection', socket => {
    console.log('cliente conectado')
  })
  io.on('message', message => {
    console.log('Mensaje recibido en el servidor:', message)
  })
  return io
}

module.exports = initSocketServer