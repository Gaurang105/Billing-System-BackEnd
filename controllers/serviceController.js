const Service = require("../models/service.js");
const { isValidPrice } = require("../utils/isValidPrice.js");

module.exports.addService = async (req, res) => {
  try {
    // Creating a new service

    const { name, price } = req.body;

    if (!name || name.trim() === "") {
      return res.status(400).json({ message: "Service name is required" });
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

    const service = new Service({
      name: req.body.name,
      price: req.body.price,
    });

    // Save the service to the database
    await service.save();

    res.status(201).json({ message: "Service added successfully" });
  } catch (error) {
    res.status(500).json({ message: "An error occurred" });
  }
};
