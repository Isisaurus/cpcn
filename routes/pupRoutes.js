const express = require('express');
const pupController = require('../controllers/pupController');
const authController = require('./../controllers/authController');
const router = express.Router();

router.route('/latest').get(pupController.latest, pupController.getAllPups);

router
  .route('/')
  .get(pupController.getAllPups)
  .post(
    authController.protect,
    authController.restrictTo('admin'),
    pupController.createPup
  );
router
  .route('/:id')
  .patch(
    authController.protect,
    authController.restrictTo('admin'),
    pupController.updatePup
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin'),
    pupController.deletePup
  )
  .get(pupController.getPup);

module.exports = router;
