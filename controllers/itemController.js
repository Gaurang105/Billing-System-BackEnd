
const Product = require('../models/product.js');
const Service = require('../models/service.js');


module.exports.getItems = async (req, res) => {
    try {

        const products = await Product.find();
        const services = await Service.find();
    
        res.status(200).json({ products, services });
      } catch (error) {
        res.status(500).json({ message: 'An error occurred' });
      }
}