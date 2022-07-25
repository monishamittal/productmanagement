const express = require('express');
const router = express.Router();
const orderController = require("../controller/orderController")
const cartController = require("../controller/cartController")
const productController = require("../controller/productController")
const userController = require("../controller/userController")

router.post('/register',userController.createUser);
// router.post('/register',userController.loginUser);
// router.get('/user/:userId/profile',userController.getUser);
// router.put('/user/:userId/profile',userController.updateUser);

// router.post('/products',productController.createProduct);
// router.get('/products',productController.getProduct);
// router.get('/products/:productId',productController.getProductByParam);
// router.put('/products/:productId',productController.updateProduct);
// router.delete('/products/:productId',productController.deleteProduct);

// router.post('/users/:userId/cart',cartController.createCart);
// router.put('/users/:userId/cart',cartController.updateCart);
// router.get('/users/:userId/cart',cartController.getCart);
// router.delete('/users/:userId/cart',cartController.deleteCart);

// router.post(' /users/:userId/orders',orderController.createOrder);
// router.put(' /users/:userId/orders',orderController.updateOrder);





module.exports = router;
