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

		//Agregar la clave role a la informacion del usuario
    const newUserInfo = {
      first_name,
      last_name,
      email,
      age,
      password,
      role
    }

    // Crear un nuevo usuario con su respectiva info y rol
    const user = await Users.create(newUserInfo)

    // Crear un nuevo carrito para el usuario y vincularlo con su ID
    const cart = new Cart({
      userId: user._id
    });
    // Vincular el id del carrito con el usuario
    user.cartId = cart._id
    // Guardar el carrito con el id del usuario
    await cart.save();

		return user
	} catch (error) {
		return error
	}
}


module.exports = {usersCreate}
