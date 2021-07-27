const express = require('express');
const eventController = require('./../controllers/eventController');
const authController = require('./../controllers/authController');

const router = express.Router();

router
  .route('/upcoming')
  .get(eventController.upcoming, eventController.getAllEvents);

router
  .route('/stats/:year')
  .get(
    authController.protect,
    authController.restrictTo('admin'),
    eventController.getEventStats
  );

router
  .route('/')
  .get(eventController.getAllEvents)
  .post(
    authController.protect,
    authController.restrictTo('admin'),
    eventController.createEvent
  );
router
  .route('/:id')
  .patch(eventController.updateEventByID)
  .delete(
    authController.protect,
    authController.restrictTo('admin'),
    eventController.deleteEventByID
  )
  .get(eventController.getEventByID);

module.exports = router;
