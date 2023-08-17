const express = require('express');
const router = express.Router();
const ItemControl = require('../controllers/itemController.js');



// fetching all the items
// testing of this API using browser done //
router.get('/', ItemControl.getItems);


module.exports = router;
