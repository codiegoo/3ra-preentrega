const Products = require('../../models/Products.model')
const Cart = require('../../models/Carts.model');
const ErrorRepository = require('./errors.repository');
const uuid = require('uuid');
const logger = require('../../config/logs/logger.config');


class ProductsRepository {
  async searchProducts(req, message, cartId){
    try {
      //Querys para filtrar los productos
      const limit = parseInt(req.query.limit) || 10;
      const page = parseInt(req.query.page) || 1;
      const sort = req.query.sort === 'asc' ? 'price' : req.query.sort === 'desc' ? '-price' : null;
      const query = req.query.query? {$and: [{$or: [
                  { name: { $regex: new RegExp(req.query.query, 'i') } },
                  { description: { $regex: new RegExp(req.query.query, 'i') } },
                ],
              },{category: {
                  $regex: req.query.category || '',
                  $options: 'i',
                },
              },
            ],
          }
        : { category: { $regex: req.query.category || '', $options: 'i' } };

      //buscar, paginar, filtrar productos
      const cart = await Cart.findById(cartId);
      const products = await Products.paginate(query, {
        limit: limit,
        page: page,
        sort: sort,
      });
      const totalPages = products.totalPages;
      const prevPage = products.prevPage;
      const nextPage = products.nextPage;
      const currentPage = products.page;
      const hasPrevPage = products.hasPrevPage;
      const hasNextPage = products.hasNextPage;
      const prevLink = hasPrevPage
        ? `http://${req.headers.host}/api/dbProducts?page=${prevPage}&limit=${limit}&sort=${sort}&query=${query}`
        : null;
      const nextLink = hasNextPage
        ? `http://${req.headers.host}/api/dbProducts?page=${nextPage}&limit=${limit}&sort=${sort}&query=${query}`
        : null;

      
      const numProdCart = cart.productos.length
      //agregar mensaje y id de carrito
      const productList = {
        title: 'Lista de Productos',
        products: products.docs,
        cartId: cartId,
        cartQuantity: numProdCart,
        message: message,
        totalPages: totalPages,
        prevPage: prevPage,
        nextPage: nextPage,
        page: currentPage,
        hasPrevPage: hasPrevPage,
        hasNextPage: hasNextPage,
        prevLink: prevLink,
        nextLink: nextLink,
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true,
      }


      logger.debug('Productos encontrados: ', productList)

      return productList
      
    } catch (error) {
      logger.error('No se encontraron productos', error)
      throw new ErrorRepository(400)
    }
  }


  async generateMockProducts(){
    try {
      const mockProducts = [];

      for (let i = 1; i <= 100; i++) {
        const product = {
          _id: uuid.v4(),
          name: `Product ${i}`,
          description: `Description ${i}`,
          price: Math.random() * 100000,
          stock: Math.floor(Math.random() * 100),
          code: `Code ${i}`,
          category: `Category ${i}`,
          status: true,
          img: `https://example.com/image${i}.jpg`
        };
    
        mockProducts.push(product);
      }
      
      logger.debug('Productos generados: ', mockProducts)
      return mockProducts;
    } catch (error) {
      logger.error('Error al generar los productos', error)
      throw new ErrorRepository('Error al generar los productos', 400)
    }
  }
}

module.exports = ProductsRepository