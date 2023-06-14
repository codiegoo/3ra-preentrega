const ProductsRepository = require('./repository/products.repository')



async function productSearch(req, message, cartId){
try {
  const productsRepository = new ProductsRepository()
  const products = await productsRepository.searchProducts(req, message, cartId)
  return products
} catch (error) {
  return error
}
}


module.exports = productSearch
