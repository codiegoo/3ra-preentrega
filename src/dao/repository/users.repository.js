const bcrypt = require('bcrypt')
const Users = require('../../models/Users.model')
const Cart = require('../../models/Carts.model')
const { admin_email, admin_password } = require('../../config/superUser.config')
const logger = require('../../config/logs/logger.config')
const nodemailer = require('nodemailer')
const ErrorRepository = require('./errors.repository')


class UserRepository {

  async createUser(userInfo) {
    try {
      const {first_name,last_name,email,age,password} = userInfo

      if(!userInfo){
        throw new ErrorRepository('Datos incorrectos, verifica que los campos no esten vacios!', 400)
      }

      // Verificar si el usuario es admin y lo clasifica
      let role = 'usuario'
      // Comparar la contraseña ingresada con el hash almacenado en la variable admin_password
      const passwordMatch = bcrypt.compare(password, admin_password)
  
      if (email === admin_email && passwordMatch) {
        role = 'administrador';
      }
  
      //crear un carrito para el usuario
      const cart = new Cart()
      await cart.save()
      const cartId = cart._id
      
      //Agregar la clave role a la informacion del usuario
      const newUserInfo = {
        first_name,
        last_name,
        email,
        age,
        password,
        role,
        cartId,
      }
      //Crear un nuevo usuario con su respectiva info y rol
      const user = await Users.create(newUserInfo)

      logger.info('Usuario creado con exito', user)
      return user
    } catch (error) {
      logger.error('Error al crear el usuario, verifica tus datos.', error)
      throw new ErrorRepository('Error al crear el usuario', 500)
    }
  }


  async changeUserRole(user){
    try {

      const usuario = await Users.findOne({_id: user._id})
      
      if(usuario.role === 'usuario'){
        usuario.role = 'premium'
      }else{
        usuario.role = 'usuario'
      }

      await usuario.updateOne({role: usuario.role})
      
      return usuario
    } catch (error) {
      logger.error('Error al cambiar el role del usuario', error)
      throw new ErrorRepository('Error al cambiar el rol', 500)
    }
  }

  async sendPasswordResetEmail(email){
    // Configura el transporte de nodemailer para enviar el correo electrónico
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'diegoedvflores03@gmail.com',
        pass: 'lipcjmltkzpzljny',
      }
    });
  
    // Crea el enlace de restablecimiento de contraseña
    const resetLink = `http://localhost:3000/api/login/forgot-password/${email}`;
  
    // Configura el correo electrónico
    const mailOptions = {
      from: 'diegoedvflores03@gmail.com',
      to: email,
      subject: 'Restablecimiento de contraseña',
      text: `Para restablecer tu contraseña, haz clic en el siguiente enlace: ${resetLink}`,
    };
  
    // Envía el correo electrónico
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error al enviar el correo electrónico:', error);
      } else {
        console.log('Correo electrónico enviado:', info.response);
      }
    });
  }
}

module.exports = UserRepository