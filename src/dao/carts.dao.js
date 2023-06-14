const CartsRepository = require('./repository/carts.repository')


async function saveProductInCar(cart, product) {
  try {
    const cartsRepository = new CartsRepository()
    return cartsRepository.saveProduct(cart, product)
  } catch (error) {
    return error
  }
}


module.exports = saveProductInCar