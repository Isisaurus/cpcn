const express = require('express');
const authController = require('./../controllers/authController');
const userController = require('./../controllers/userController');
const router = express.Router();

// upload gallery photos
router.post(
  '/uploadImage',
  authController.protect,
  authController.restrictTo('admin'),
  userController.uploadGalleryImage,
  userController.uploadedImg
);

//create users
router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/logout', authController.logout);

//manage passwords
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);
router.patch(
  '/updateMyPassword',
  authController.protect,
  authController.updatePassword
);

module.exports = router;
