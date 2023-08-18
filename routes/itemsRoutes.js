const express = require('express');
const router = express.Router();
const ItemControl = require('../controllers/itemController.js');



// fetching all the items
router.get('/', ItemControl.getItems);


module.exports = router;
