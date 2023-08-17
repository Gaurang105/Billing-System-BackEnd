const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middleware/authentication");
const CartControl = require("../controllers/cartController");


// fetching the cart for the authenticated user
router.get("/", authenticateToken, CartControl.getCart);


// Adding an item to the cart
router.post("/:type/:itemId", authenticateToken, CartControl.addToCart);


// Removing an item from the cart
router.delete("/:type/:itemId", authenticateToken, CartControl.deleteFromCart);


// Clearing the cart
router.delete("/", authenticateToken, CartControl.clearCart);


// cart checkout + generating bill
router.post('/checkout', authenticateToken, CartControl.checkout);


// confirming an order
// Confirm the order and create a new order entry
router.post('/confirmOrder', authenticateToken, CartControl.confirmOrder);


module.exports = router;
