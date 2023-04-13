const { Router } = require('express')
const Cart = require('../models/Carts.model')
const Products = require('../models/Products.model')
const router = Router()


router.get('/', async (req, res) => {
  try {
    const newCart = await Cart.create({})
    console.log('Nuevo carrito creado:', newCart)
    res.status(201).json(newCart)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Error al crear un nuevo carrito' })
  }
})


router.post('/:cartId/:productId', async (req, res) => {
  try {
    const cart = await Cart.findOne({ _id: req.params.cartId });
    const product = await Products.findOne({_id: req.params.productId});
    if (!product) throw new Error('Product not found');

    const item = cart.productos.find(item => item.product === product.id);
    if (item) {
      // Si el producto ya existe en el carrito, aumenta la cantidad en req.body.quantity
      item.quantity ++
    } else {
      // Si el producto no existe en el carrito, agrega un nuevo objeto al array de productos
      cart.productos.push({
        product: product.id,
        quantity: 1
      });
    }

    await cart.save();
    res.json({ message: 'Product added to cart', cart });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Error adding product to cart' });
  }
});

module.exports = router