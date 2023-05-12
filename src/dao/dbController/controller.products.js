const { Router } = require('express')
const Products = require('../models/Products.model')
const Cart = require('../models/Carts.model')
const uploader = require('../../utils/multer.utils')
const router = Router()
const privateAccess = require('../../middlewares/privateAccess.middleware')
const productSearch = require('../dbDao/products.dao')



// Utiliza el middleware de acceso privado para verificar que el usuaio este autenticado si no lo redirecciona al login
router.get('/', privateAccess, async (req, res) => {
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
    const products = await productSearch(req, message, cartId)
    //renderizamos la vista handlebars y pasamos los datos con los que trabajaremos
    res.render('products.handlebars', products);
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message,
    });
  }
});

router.post('/', uploader.single('file'), async (req, res) => {
  try {
    const newProduct = await Products.create(req.body)
    res.json({message: newProduct})
  } catch (error) {
    console.log(error)
  }
})

router.put('/:productId', async (req, res) => {
  try {
    const updatedProduct = await Products.findByIdAndUpdate(req.params.productId, req.body, { new: true })
    res.json({ message: 'Product updated successfully', product: updatedProduct })
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Error updating product' })
  }
})

router.delete('/:productId', async (req, res) => {
  try {
    const deletedProduct = await Products.findByIdAndDelete(req.params.productId)
    res.json({message: `Product with ID ${req.params.productId} has been deleted`})
  } catch (error) {
    console.log(error)
    res.status(500).json({error: 'Error deleting product'})
  }
})



module.exports = router