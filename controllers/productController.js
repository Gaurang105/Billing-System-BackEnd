const Product = require("../models/product");
const { isValidPrice } = require("../utils/isValidPrice.js");

module.exports.addProduct = async (req, res) => {
  try {
    // Creating a new product

    const { name, price } = req.body;

    if (!name || name.trim() === "") {
      return res.status(400).json({ message: "Product name is required" });
    }

    if (!price) {
      return res.status(400).json({ message: "Please provide price" });
    }

    if (!isValidPrice(price)) {
      return res
        .status(400)
        .json({
          message: "Invalid price. Price must be a non-negative number",
        });
    }

    const product = new Product({
      name: req.body.name,
      price: req.body.price,
    });

    // Save the product to the database
    await product.save();

    res.status(201).json({ message: "Product added successfully" });
  } catch (error) {
    res.status(500).json({ message: "An error occurred" });
  }
};
