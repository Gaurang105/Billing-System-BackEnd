const express = require('express');
const router = express.Router();
const {isAdmin} = require('../middleware/authentication.js');
const ProductController = require("../controllers/productController.js");

// Add a product will only be accessible by the admin
router.post('/add', isAdmin, ProductController.addProduct);


module.exports = router;