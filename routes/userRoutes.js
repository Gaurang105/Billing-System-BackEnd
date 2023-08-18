const express = require('express');
const router = express.Router();
const UserControl = require('../controllers/userController.js');

router.post('/register', UserControl.register);
router.post('/login', UserControl.login);
router.get('/logout', UserControl.logout);

module.exports = router;
