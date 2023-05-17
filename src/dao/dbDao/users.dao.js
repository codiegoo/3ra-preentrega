const Users = require('../models/Users.model')
const Cart = require('../models/Carts.model')


async function usersCreate(userInfo){

	try {
		const {first_name,last_name,email,age,password} = userInfo

    // Verificar si el usuario es admin y lo clasifica
    let role = 'usuario'
    if (email === 'admin@gmail.com' && password === 'admin') {
      role = 'administrador'
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
		return user
	} catch (error) {
		return error
	}
}


module.exports = {usersCreate}
