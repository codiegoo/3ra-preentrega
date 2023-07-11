const Tickets = require('../../models/Tickets.model')
const Products = require('../../models/Products.model')
const ErrorRepository = require('./errors.repository')
const logger = require('../../config/logs/logger.config')


class TicketsRepository{


  async processDataTicket(code, userEmail, cart) {
    try {
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
        }else{
          throw new ErrorRepository('Productos no encontrados', 404)
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

      logger.info('Ticket con los productos procesados', ticket)
  
      return {
        ticket: ticket,
        unprocessedProducts: unprocessedProducts
      }
    } catch (error) {
      logger.error('Error al procesar los productos para la compra', error)
      throw new ErrorRepository('error al procesar tu compra', 400)
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
      logger.error('Error al buscar los productos', error)
      throw new ErrorRepository('Error al procesar los productos', 400)
    } 
  }
}


module.exports = TicketsRepository