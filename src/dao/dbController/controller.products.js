const { Router } = require('express')
const Products = require('../../models/Products.model')
const Cart = require('../../models/Carts.model')
const router = Router()
const privateAccess = require('../../middlewares/privateAccess.middleware')
const adminAccess = require('../../middlewares/adminAcces.middleware')
const userAcces = require('../../middlewares/userAcces.middleware')
const productsDao = require('../products.dao')
const logger = require('../../config/logs/logger.config')
const ErrorRepository = require('../repository/errors.repository')
const mailerDao = require('../mailer.dao')


// Utiliza el middleware de acceso privado para verificar que el usuaio este autenticado si no lo redirecciona al login
router.get('/', privateAccess, async (req, res, next) => {
  try {
    // Verificar si hay un usuario autenticado y pasar sus datos a la vista
    const user = req.session.user;
    const message = user
      ? `Bienvenido ${user.role} ${user.first_name} ${user.last_name}!`
      : null;
    // Buscar el carrito del usuario por el id del usuario
    const cart = await Cart.findOne({ _id: user.cartId });
    // parsear el objeto con el id del usuario a cadena
    const cartId = cart._id.toString()
    const products = await productsDao.searchProducts(req, message, cartId)


    logger.info('Productos cargados con exito', products)

    //renderizamos la vista handlebars y pasamos los datos con los que trabajaremos
    res.status(200).render('products.handlebars', products);
  } catch (error) {
    logger.error('Error al cargar los productos', error)
    next(error)
  }
});


//genera 100 productos con el mismo formato que los de la db
router.get('/mockingProducts',userAcces, async (req, res, next) => {
  try {
    const mockProducts = await productsDao.generateMockProducts()
    res.json({Productos: mockProducts})
  } catch (error) {
    logger.error('Error al generar los productos', error)
    next(error)
  }
})


//Agregar un nuevo producto a la db
router.post('/', adminAccess , async (req, res, next) => {
  try {

    if(req.session.user.role !== 'premium' && req.session.user.role !== 'administrador'){
      throw new ErrorRepository('Rol de usuario rechazado', 401)
    }

    if(req.body.owner === null){
      req.body.owner === 'administrador'
    }

    req.body.owner = req.session.user.email

    const newProduct = await Products.create(req.body)
    logger.info('Se agrego un producto a la db', newProduct)
    res.status(200).json({message: newProduct})
  } catch (error) {
    logger.error('Error al agregar producto', error)
    next(error)
  }
})

//Actualizar un producto en especifico
router.put('/:productId', adminAccess, async (req, res, next) => {
  try {


    // const product = await Products.findById(req.params.productId)
    // const user = req.session.user

    // if (user.role === 'administrador' || (user.email !== 'premium' && product.owner !== 'premium')) {
    //   return new ErrorRepository('No tienes permiso para modificar este producto', 401)
    // }

    const updatedProduct = await Products.findByIdAndUpdate(req.params.productId, req.body, { new: true })
    logger.info('Producto actualizado con exito', updatedProduct)
    res.status(200).json({ message: 'Product updated successfully', product: updatedProduct })
  } catch (error) {
    logger.error('Error al actualizar el producto')
    next(error)
  }
})

router.delete('/:productId', adminAccess , async (req, res, next) => {
  try {
    const product = await Products.findById(req.params.productId);
    const user = req.session.user;

    if(user.role === 'premium'){

      const mailOptions = {
        from: 'diegoedvflores03@gmail.com',
        to: user.email,
        subject: 'Producto Eliminado',
        text: `Tu producto ${product.name} fue eliminado por terminos de privacidad`,
      }

      await mailerDao.sendMail(mailOptions)
    }

    if (user.role === 'administrador' || (user.role === product.owner)) { // Comparamos user.role con product.owner
      await Products.findByIdAndDelete(req.params.productId);
      logger.info('Producto eliminado', req.params.productId);
      res.json({ message: `Product with ID ${req.params.productId} has been deleted` });
    } else {
      throw new ErrorRepository('No tienes permiso para eliminar este producto', 401);
    }
  } catch (error) {
    logger.error('Error al eliminar el producto', error);
    next(error);
  }
})



module.exports = router