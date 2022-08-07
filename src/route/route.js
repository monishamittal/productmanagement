//--------------------requiring modules--------------------
const express = require('express');
const router = express.Router();
const orderController = require("../controller/orderController")
const cartController = require("../controller/cartController")
const productController = require("../controller/productController")
const userController = require("../controller/userController")
const middleware = require("../middleware/auth")

//--------------------for user--------------------
router.post('/register', userController.createUser);
router.post('/login', userController.loginUser);
router.get('/user/:userId/profile', middleware.authentication, userController.getUser);
router.put('/user/:userId/profile', middleware.authentication, middleware.authorization, userController.updateUser);

//--------------------for products--------------------
router.post('/products', productController.createProduct);
router.get("/products", productController.getProduct)
router.get('/products/:productId', productController.getProductByParam);
router.put('/products/:productId', productController.updateProduct);
router.delete('/products/:productId', productController.deleteProduct);

//--------------------for cart--------------------
router.post('/users/:userId/cart', middleware.authentication, middleware.authorization, cartController.createCart);
router.get('/users/:userId/cart', middleware.authentication, middleware.authorization, cartController.getCart);
router.put('/users/:userId/cart', middleware.authentication, middleware.authorization, cartController.updateCart);
router.delete('/users/:userId/cart', middleware.authentication, middleware.authorization, cartController.deleteCart);

//--------------------for orders--------------------
router.post('/users/:userId/orders', middleware.authentication, middleware.authorization, orderController.createOrder);
router.put('/users/:userId/orders', middleware.authentication, middleware.authorization, orderController.updateOrder);

//--------------------making file public--------------------
module.exports = router;