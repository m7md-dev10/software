const express = require('express');
const router = express.Router();
const userController = require('../controllers/signUpController');
const mainUserController = require('../controllers/userController'); // Renamed to avoid conflict

 //public
 router.post('/register', userController.register);
 router.post('/login', userController.login);
router.post('/forgetPassword', userController.forgotPassword);
router.post('/resetPassword', userController.resetPassword);

 // Public logout endpoint
router.post('/logout', mainUserController.logout); // Uses the logout method from the main userController

 module.exports = router;