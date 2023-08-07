const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'diegoedvflores03@gmail.com',
    pass: 'lipcjmltkzpzljny',
  }
});

class MailerRepository {


  sendMail(mailOptions){
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error al enviar el correo electrónico:', error);
      } else {
        console.log('Correo electrónico enviado:', info.response);
      }
    })
  }
} 


module.exports = MailerRepository