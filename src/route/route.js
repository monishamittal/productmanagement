const express = require('express');
const router = express.Router();
const orderController = require("../controller/orderController")
const cartController = require("../controller/cartController")
const productController = require("../controller/productController")
const userController = require("../controller/userController")
const middleware = require("../middleware/auth")

router.post('/register', userController.createUser);
router.post('/login', userController.loginUser);
router.get('/user/:userId/profile', middleware.authentication, userController.getUser);
router.put('/user/:userId/profile', middleware.authentication,middleware.authorization, userController.updateUser);         //middleware.authorization

router.post('/products',productController.createProduct);
router.get("/products",productController.getProduct)
router.get('/products/:productId',productController.getProductByParam);
router.put('/products/:productId',productController.updateProduct);
router.delete('/products/:productId',productController.deleteProduct);

router.post('/users/:userId/cart',cartController.createCart);
router.put('/users/:userId/cart',cartController.updateCart);
router.get('/users/:userId/cart',cartController.getCart);
router.delete('/users/:userId/cart',cartController.deleteCart);

// router.post(' /users/:userId/orders',orderController.createOrder);
// router.put(' /users/:userId/orders',orderController.updateOrder);

module.exports = router;