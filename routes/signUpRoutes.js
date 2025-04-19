const express = require('express');
const router = express.Router();
const userController = require('../controllers/signUpController');
const authMiddleware = require('../middleware/authMiddleware');
const authoMiddleware = require('../middleware/authoMiddleware');

 //public
 router.post('/register', userController.register);
 router.post('/login', userController.login);
 router.put('/forgetPassword', userController.forgotPassword);
 router.post('/resetPassword/:token', userController.resetPassword);

 module.exports = router;