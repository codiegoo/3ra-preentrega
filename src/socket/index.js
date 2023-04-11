const socketIo = require('socket.io')

const initSocketServer = httpServer => {
  const io = socketIo(httpServer)

  io.on('connection', socket => {
    console.log('cliente conectado')
    io.emit('mensaje', 'hola desde el server')
  })

  return io
}

module.exports = initSocketServer