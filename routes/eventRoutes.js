const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const authMiddleware = require('../middleware/authMiddleware');
const authoMiddleware = require('../middleware/authoMiddleware');

// protected admin
router.get('/all',authMiddleware,authoMiddleware(['System Admin']),eventController.getAllEventsForAdmin)
router.patch('/:id/status', authMiddleware,authoMiddleware(['System Admin']), eventController.updateEventStatus);

// public
router.get('/:id',eventController.getEvent);
router.get('/', eventController.getAllEvents);

// protected organizer
router.post('/', authMiddleware,authoMiddleware(['Organizer']), eventController.createEvent);

//dual authorization
router.put('/:id', authMiddleware,authoMiddleware(['Organizer','System Admin']), eventController.updateEvent);
router.delete('/:id', authMiddleware,authoMiddleware(['Organizer','System Admin']), eventController.deleteEvent);

module.exports = router;