const express = require('express');
const router = express.Router();
const UserControl = require('../controllers/userController.js');



// User's Registration API endpoint //
// API Testing done using Postman and MongoDB //

// 1st Admin
// admin email -> arjitgiri@gmail.com
// admin password -> arjitgiri
// isAdmin - > true


// 1st user 
// username -> xyzuser@gmail.com
// password -> xyz
router.post('/register', UserControl.register);



// user's login and generating a JWT Token for Authentication purposes //
router.post('/login', UserControl.login);



// storing JWT token in the form of Cookie //
// will help to delete the token easily//
// user logout using authenticateToken and cookie-parser middlewares //
router.get('/logout', UserControl.logout);



module.exports = router;
