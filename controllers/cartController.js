const {
  calculateProductTax,
  calculateServiceTax,
} = require("../utils/taxCalculator.js");
const Cart = require("../models/cart.js");
const Product = require("../models/product.js");
const Service = require("../models/service.js");
const TotalBill = require("../models/totalBill.js");
const Order = require("../models/order.js");


module.exports.getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.userId })
      .populate("products.item")
      .populate("services.item");

    res.status(200).json({ cart });
  } catch (error) {
    res.status(500).json({ message: "An error occurred" });
  }
}


module.exports.addToCart = async (req, res) => {
    try {

        const userId = req.user.userId;
        const { type, itemId } = req.params;
        const { quantity } = req.body;

        if (!quantity || !Number.isInteger(quantity) || quantity <= 0) {
          return res.status(400).json({ message: 'Invalid quantity. Quantity must be a positive whole number.' });
        }
    
        let cart = await Cart.findOne({ userId });
    
        if (!cart) {
          cart = new Cart({ userId, products: [], services: [] });
        }

        let item;
        let tax;
        let totalPrice;
        let price;
    
        if (type === "product") {

          item = await Product.findById(itemId);
          tax = calculateProductTax(item.price, quantity);
          price = item.price;
          totalPrice = price * quantity + tax;

          const existingProductIndex = cart.products.findIndex((product) => product.item.toString() === itemId);

          if (existingProductIndex !== -1) {

            cart.products[existingProductIndex].quantity += quantity;
            cart.products[existingProductIndex].totalPrice += totalPrice;
            cart.products[existingProductIndex].tax += tax;

          } else {

            cart.products.push({ item: itemId, quantity, price, tax, totalPrice});

          }
    
        } else if (type === "service") {
    
          item = await Service.findById(itemId);
          tax = calculateServiceTax(item.price, quantity);
          price = item.price;
          totalPrice = price * quantity + tax;

          const existingServiceIndex = cart.services.findIndex((service) => service.item.toString() === itemId);

          if (existingServiceIndex !== -1) {
           
            cart.services[existingServiceIndex].quantity += quantity;
            cart.services[existingServiceIndex].totalPrice += totalPrice;
            cart.services[existingServiceIndex].tax += tax;

          } else {
            cart.services.push({ item: itemId, quantity, price, tax, totalPrice});
          }
    
          
        } else {
          return res.status(400).json({ message: "Invalid item type" });
        }
    
        await cart.save();

        res.status(200).json({ message: "Item added to the cart", cart });
      } catch (error) {
        res.status(500).json({ message: "An error occurred", error });
      }
}


module.exports.deleteFromCart = async (req, res) => {
  try{

    const userId = req.user.userId;
    const { type, itemId } = req.params;

    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    let items;
    if (type === 'product') {
      items = cart.products;
    } else if (type === 'service') {
      items = cart.services;
    } else {
      return res.status(400).json({ message: 'Invalid item type' });
    }

    const updatedItems = items.filter((item) => item.item.toString() !== itemId);

    if (type === 'product') {
      cart.products = updatedItems;
    } else if (type === 'service') {
      cart.services = updatedItems;
    }

    await cart.save();

    res.status(200).json({ message: 'Item removed from the cart', cart});
  } 
   
  catch (error) {
    res.status(500).json({ message: 'An error occurred' });
  }

}



module.exports.clearCart = async (req, res) => {
  try {
    const userId = req.user.userId;

    await Cart.findOneAndDelete({ userId });

    res.status(200).json({ message: "Cart cleared successfully", Cart});
  } catch (error) {
    res.status(500).json({ message: "An error occurred" });
  }
}




module.exports.checkout  = async(req, res) => {
  try {
    
    const userId = req.user.userId;

    const cart = await Cart.findOne({ userId }).populate('products.item').populate('services.item');

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const items = [...cart.products, ...cart.services];

    let totalValue = 0;
    let products = [];
    let services = [];

    for (const item of items) {

      const {item: itemId, quantity, price, tax, totalPrice} = item;

      if (item.item instanceof Product) {

        products.push({item: itemId, quantity, price, tax, totalPrice});

      } else if (item.item instanceof Service) {

      
        services.push({ item: itemId, quantity, price, tax, totalPrice});

      } else {
        continue;
      }

      totalValue += totalPrice;

    }

    totalValue = parseFloat(totalValue.toFixed(2));

    let totalBill = new TotalBill({ userId, products , services, totalValue});

    await totalBill.save();

    res.status(200).json({ message: 'Checkout successful', totalBill});
  } catch (error) {
    res.status(500).json({ message: 'error occurred in checkout' });
  }
}



module.exports.confirmOrder = async(req, res) => {

  try {

    const userId = req.user.userId;

    const totalBill = await TotalBill.findOne({ userId });

    if (!totalBill) {
      return res.status(404).json({ message: 'Total bill not found. Maybe you need to checkout your cart first' });
    }

    let products = totalBill.products;
    let services = totalBill.services;
    let totalValue = totalBill.totalValue;

    if (products.length === 0 && services.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    let order = new Order({ userId, products , services, totalPrice: totalValue});

    await order.save();

    // Clear the cart and total bill after confirming the order
    await Cart.findOneAndDelete({ userId });
    
    await TotalBill.findOneAndDelete({ userId });

    res.status(200).json({ message: 'Order confirmed successfully', order});
  } catch (error) {
    res.status(500).json({ message: 'An error occurred' });
  }
  
}

