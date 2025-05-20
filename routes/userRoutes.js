const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const authoMiddleware = require('../middleware/authoMiddleware');

 //authenticated
router.get('/profile', authMiddleware, userController.getProfile);
router.put('/profile', authMiddleware, userController.updateProfile);

 //user
router.get('/bookings', authMiddleware,authoMiddleware(['Standard User']), userController.getUserBookings);

 //organizer
router.get('/events',authMiddleware,authoMiddleware(['Organizer']),userController.getOrganizerEvents);
router.get('/events/analytics',authMiddleware,authoMiddleware(['Organizer']),userController.getOrganizerAnalytics);
router.get('/events/:id', authMiddleware, authoMiddleware(['Organizer']), userController.getOrganizerEventById);

 //admin
router.get('/', authMiddleware,authoMiddleware(['System Admin']), userController.getAllUsers);
router.put('/:id', authMiddleware,authoMiddleware(['System Admin']), userController.updateUserRole);
router.delete('/:id', authMiddleware,authoMiddleware(['System Admin']), userController.deleteUser);
router.get('/:id', authMiddleware,authoMiddleware(['System Admin']), userController.getUserById);

//protected
router.post('/logout', authMiddleware, userController.logout);



module.exports = router;