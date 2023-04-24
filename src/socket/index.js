const socketIo = require('socket.io')
const Message = require('../dao/models/Messages.model')
const Cart = require('../dao/models/Carts.model')

const initSocketServer = httpServer => {
  const io = socketIo(httpServer);

  io.on('connection', async socket => {
    console.log('cliente conectado');

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
  });

  return io;
}


module.exports = initSocketServer