const Tickets = require('../../models/Tickets.model')
const Products = require('../../models/Products.model')


class TicketsRepository{

  async processDataTicket(code, userEmail, cart) {


    const processedProducts = []
    const unprocessedProducts = []
    let totalAmount = 0

  
    for (let i = 0; i < cart.productos.length; i++) {
      const item = cart.productos[i];

      
      const product = await this.processItem(item, processedProducts, unprocessedProducts)
      if (product) {
        const productQuantity = item.quantity;
        const productTotalPrice = product.price * productQuantity;
        totalAmount += productTotalPrice;
      }
    }

    

    cart.productos = cart.productos.filter((item) => !processedProducts.some((processedItem) => processedItem._id.toString() === item.product._id.toString()));
    await cart.save();

    const ticket = await Tickets.create({
      code: code,
      purchase_datetime: Date.now(),
      amount: totalAmount,
      purchaser: userEmail,
      processProducts: processedProducts
    });

    return {
      ticket: ticket,
      unprocessedProducts: unprocessedProducts
    }
  }

  async processItem(item, processedProducts, unprocessedProducts) {
    const productId = item.product._id;
    const productQuantity = item.quantity


    try {
      const product = await Products.findById(productId);
  
      if (productQuantity <= product.stock) {
        product.stock -= productQuantity;
        await product.save();
        processedProducts.push(product);
        return product
      } else {
        unprocessedProducts.push(product);
      }
    } catch (error) {
     console.error(error);
    } 
  }
}


module.exports = TicketsRepository