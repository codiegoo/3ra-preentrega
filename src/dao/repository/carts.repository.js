const Tickets = require('../../models/Tickets.model')


class CartsRepository {
  async saveProduct(cart, product) {
    try {
      if (!product) throw new Error('Product not found');

      const itemIndex = cart.productos.findIndex(item => item.product._id.equals(product._id));
      if (itemIndex !== -1) {
        // Si el producto ya existe en el carrito, aumenta la cantidad en 1
        cart.productos[itemIndex].quantity += 1;
      } else {
        // Si el producto no existe en el carrito, agrega un nuevo objeto al array de productos
        cart.productos.push({
          product: product,
          quantity: 1
        });
      }
      await cart.save();
    } catch (error) {
      throw error
    }
  }


  async processDataTicket(code, userEmail, cart) {

    const processedProducts = []
    const unprocessedProducts = [];
    let totalAmount = 0;
  
    await Promise.all(
      cart.productos.map(async (item) => {
        const product = item.product;
        const requestedQuantity = item.quantity;
  
        if (requestedQuantity <= product.stock) {
          product.stock -= requestedQuantity;
          await product.save();
          totalAmount += product.price * requestedQuantity;
          processedProducts.push(item)
        } else {
          unprocessedProducts.push(product._id);
        }
      })
    );

    cart.productos = processedProducts
    await cart.save()

    const ticket = await Tickets.create({
      code: code,
      purchase_datatime: Date.now(),
      amount: totalAmount,
      purchaser: userEmail
    });

    return ticket, unprocessedProducts

  }
}

module.exports = CartsRepository