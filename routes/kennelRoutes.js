const express = require('express');
const kennelController = require('./../controllers/kennelController');
const authController = require('./../controllers/authController');

const router = express.Router();

router
  .route('/')
  .get(kennelController.getAllKennels)
  .post(
    authController.protect,
    authController.restrictTo('admin'),
    kennelController.createKennel
  );
router
  .route('/:id')
  .patch(
    authController.protect,
    authController.restrictTo('admin'),
    kennelController.updateKennel
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin'),
    kennelController.deleteKennel
  )
  .get(kennelController.getKennel);

module.exports = router;
