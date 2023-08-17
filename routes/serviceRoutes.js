const express = require('express');
const router = express.Router();
const {isAdmin} = require('../middleware/authentication.js');

const ServiceController = require("../controllers/serviceController.js");

// Add a service will only be accessible by the admin
router.post('/add', isAdmin, ServiceController.addService);



module.exports = router;
