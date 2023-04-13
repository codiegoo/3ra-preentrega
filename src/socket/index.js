const socketIo = require('socket.io')
const Message = require('../dao/models/Messages.model')

const initSocketServer = httpServer => {
  const io = socketIo(httpServer)


  io.on('connection', socket => {
    console.log('cliente conectado')

    Message.find().then((messages) => {
      socket.emit('old messages', messages);
    });

    socket.on('send message', (data) => {
      const message = new Message({
        user: data.user,
        message: data.message
      });
      message.save().then(() => {
        io.emit('new message', message);
      });
    });
  })
  // io.on('message', message => {
  //   console.log('Mensaje recibido en el servidor:', message)
  // })
  return io
}

module.exports = initSocketServer