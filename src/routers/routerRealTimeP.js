const { Router } = require('express')
const productManager = require('../dao/fsManager/productManager')
const router = Router()




//Muestra los productos en tiempo real
router.get('/', (req, res) => {
  const productsLimite = parseInt(req.query.limit)
  try {
    const productos = productManager.getProducts(productsLimite)
    // Envía los productos a los clientes conectados
    // const products = 'todos los porductos'
    res.status(200).render('realTimeProducts.handlebars', {productos})
  } catch (error) {
    console.error(error)
    res.status(500).send({error:`error al cargar los productos`})
  }
})


router.post('/', (req, res) => {

  const product = req.body
  try {
    productManager.addProduct(product)
    const products = productManager.getProducts()
    // console.log(products)
    const io = req.app.locals.io
    io.emit('newProduct', products)
    io.emit('message', `producto ${product.id} creado con exito!`)
    res.status(201).send({newProduct: product})
  } catch (error) {
    console.error(error)
    res.status(400).send({error:`error al crear el producto, verifica que sea un objeto y cuente con las claves y valores correctos`})
  }
})

router.delete('/:id', (req, res) => {
  const id = req.params.id
  console.log(id)
  try {
    productManager.deleteProduct(parseInt(id))
    const products = productManager.getProducts()
    const io = req.app.locals.io
    io.emit('deleteProduct', products)
    res.status(200).send({message: `producto ${id} eliminado`})
  } catch (error) {
    console.error(error)
    res.status(400).send({error: `error al eliminar el producto ${id}`})
  }
})

module.exports = router

