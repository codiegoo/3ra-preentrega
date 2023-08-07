const { Router } = require('express')
const mongoose = require('mongoose')
const Cart = require('../../models/Carts.model')
const Products = require('../../models/Products.model')
const userAcces = require('../../middlewares/userAcces.middleware')
const cartsDao = require('../carts.dao')
const ticketsDao = require('../tickets.dao')
const uuid = require('uuid')
const ErrorRepository = require('../repository/errors.repository')
const logger = require('../../config/logs/logger.config')
const router = Router()

//POST crea un carrito vacio
router.post('/', userAcces, async (req, res, next) => {
  try {
    const newCart = await Cart.create({})
    logger.info('Nuevo carrito creado!', newCart)
    res.status(200).json(newCart)
  } catch (error) {
    logger.error('Error al crear el carrito.', error)
    next(error)
  }
})

// GET muestra un carrito en especifico
router.get('/:cid',userAcces,  async (req, res, next) => {
  try {
      const cart = await Cart.findById(req.params.cid).populate('productos.product')
      res.status(200).render('carts.handlebars', {cart})
      logger.info('Se mostro el carrito: ', {cartId: req.params.cid})
    } catch (error) {
      logger.error('Error al cargar el carrito', error)
      console.log(error)
      next(new ErrorRepository('Error al mostrar el carrito', 400))
    }
  });


//POST introduce un producto en un carrito
router.post('/:cartId/:productId',  async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ _id: req.params.cartId })
    const product = await Products.findOne({_id: req.params.productId})
    // const user = req.session.user
    // if (user.role === 'premium' && product.owner !== 'premium') {
    //   return new ErrorRepository('No tienes permiso para agregar este producto', 401)
    // }

    await cartsDao.saveProduct(cart, product)

    logger.info('Producto agregado con exito!')
    res.status(200).json('se agrego el producto con exito')
  } catch (error) {
    logger.error('Error al agregar el producto', error)
    next(error)
  }
});


// PUT actualizar el carrito con un arreglo de productos
router.put('/:cid', userAcces, async (req, res, next) => {
  try {
    const cart = await Cart.findById(req.params.cid)
    cart.productos = req.body.productos
  
    await cart.save()

    res.status(200).json({ message: 'Cart updated', cart })
    logger.info('Carrito actualizado con exito!', cart)
  } catch (error) {
    logger.error('Error al actualizar el carrito', error)
    next(error)
  }
});

// PUT actualizar SÓLO la cantidad de ejemplares del producto por cualquier cantidad
router.put('/:cid/products/:pid',userAcces ,  async (req, res, next) => {
  try {
    const cart = await Cart.findById(req.params.cid)
    const item = cart.productos.find(item => item.product == req.params.pid)
    if (!item) throw new Error('Product not found in cart')
    item.quantity = req.body.quantity
    await cart.save();
    res.status(200).json({ message: 'Cart updated', cart })
    logger.info('Cantidad de producto actualizada.', cart)
  } catch (error) {
    logger.error('Error al actualizar la propiedad del producto.', error)
    next(error)
  }
});

// DELETE del carrito el producto seleccionado
router.post('/:cid/products/:pid',userAcces, async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ _id: req.params.cid })
    const productIndex = cart.productos.findIndex(item => item.product.equals(new mongoose.Types.ObjectId(req.params.pid)))
    if (productIndex === -1) throw new Error('Product not found in cart')
    cart.productos.splice(productIndex, 1)
    await cart.save()
    logger.info('Producto eliminado con exito.', cart)
    res.status(200).json('Se elimino el producto con exito')
    // res.status(200).redirect(`/api/dbCarts/${req.params
    // .cid}`)
  } catch (error) {
    logger.error('Error al eliminar el producto.', error)
    next(error)
  }
});

// DELETE todos los productos del carrito
router.delete('/:cid', userAcces, async (req, res, next) => {
  try {
    const cart = await Cart.findById(req.params.cid)
    cart.productos = []
    await cart.save()
    logger.info('Productos eliminados con exito.', cart)
    res.status(200).json({ message: 'All products removed from cart', cart })
  } catch (error) {
    logger.error('Error al eliminar todos los productos del carrito.', error)
    next(error)
  }
});


// Finalizar compra

router.get('/:cid/purchase',userAcces , async (req, res, next) => {
  try {
    const cartId = req.params.cid
    const cart = await Cart.findById(cartId)
    const userEmail = req.user.email
    const code = uuid.v4()

    const purchaseData = await ticketsDao.checkDataTicket(code, userEmail, cart)

    const ticket = purchaseData.ticket
    const unprocessedProducts = purchaseData.unprocessedProducts

    if(unprocessedProducts.length > 0){
      res.json({"Productos sin stock suficiente no procesados": unprocessedProducts,
                "Ticket de compra": ticket})
    }else{
      res.json({"Gracias por tu compra": ticket})
    }

    logger.info('Tu compra fue exitosa', ticket)
  } catch (error) {
    logger.error('Error al procesar tu compra, revisa tus datos.', error)
    next(error)
  }
})

module.exports = router