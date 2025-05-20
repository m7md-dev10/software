const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const authMiddleware = require('../middleware/authMiddleware');
const authoMiddleware = require('../middleware/authoMiddleware');

 // user
router.get('/:id', authMiddleware,authoMiddleware(['Standard User']), bookingController.getBookingById);
router.post('/', authMiddleware,authoMiddleware(['Standard User']), bookingController.bookTickets);
router.delete('/:id', authMiddleware,authoMiddleware(['Standard User']), bookingController.cancelBooking);

module.exports = router;