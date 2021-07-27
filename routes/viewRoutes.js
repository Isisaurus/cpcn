const express = require('express');
const viewsController = require('./../controllers/viewsController');
const authController = require('./../controllers/authController');

const router = express.Router();
//isLoggedIn checks if user is logged in, protect does the same

router.get('/', authController.isLoggedIn, viewsController.getHome);
router.get('/cpcn', authController.isLoggedIn, viewsController.getClub);
router.get('/fokken', authController.isLoggedIn, viewsController.getFokken);
router.get('/kennels', authController.isLoggedIn, viewsController.getKennels);
router.get('/login', authController.isLoggedIn, viewsController.getLoginForm);
router.get('/gallery', authController.isLoggedIn, viewsController.getGallery);
router.get(
  '/chodskypes',
  authController.isLoggedIn,
  viewsController.getChodksypes
);
router.get('/join', authController.isLoggedIn, viewsController.getJoin);
router.get('/pupinfo', authController.isLoggedIn, viewsController.getPups);

// Send footer message
router.post('/contact', viewsController.sendFooterMessage);

// restricted, protected administration toure, using protect
router.get(
  '/administration',
  authController.protect,
  authController.restrictTo('admin'),
  viewsController.getAdmin
);

router.post(
  '/submit-user-data',
  authController.protect,
  viewsController.updateUserData
);

module.exports = router;
