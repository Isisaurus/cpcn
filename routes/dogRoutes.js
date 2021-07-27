const express = require('express');
const dogController = require('./../controllers/dogController');
const authController = require('./../controllers/authController');

const router = express.Router();

router
  .route('/')
  .get(dogController.getAllDogs)
  .post(
    authController.protect,
    authController.restrictTo('admin'),
    dogController.createDog
  );
router
  .route('/:id')
  .patch(
    authController.protect,
    authController.restrictTo('admin'),
    dogController.updateDog
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin'),
    dogController.deleteDog
  )
  .get(dogController.getDog);

module.exports = router;
