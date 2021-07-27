const express = require('express');
const authController = require('../controllers/authController');
const membershipController = require('../controllers/membershipController');

const router = express.Router();

router.route('/').get(membershipController.getAllFees);
router
  .route('/:id')
  .post(
    authController.protect,
    authController.restrictTo('admin'),
    membershipController.updateFee
  );

module.exports = router;
