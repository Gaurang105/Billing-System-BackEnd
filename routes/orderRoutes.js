const express = require("express");
const router = express.Router();
const {isAdmin} = require("../middleware/authentication.js");
const OrderControll = require("../controllers/orderController.js");


// fetchin all the orders by Admin
router.get('/', isAdmin, OrderControll.getOrders);


module.exports = router;