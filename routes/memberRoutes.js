const express = require('express');
const memberController = require('./../controllers/memberController');
const authController = require('./../controllers/authController');

const router = express.Router();

// router
//   .route('/')
//   .get(
//     authController.protect,
//     authController.restrictTo('admin'),
//     memberController.getAllMembers
//   )
//   .post(memberController.createMember);

router.route('/').post(memberController.createMember);

// router
//   .route('/:id')
//   .delete(
//     authController.protect,
//     authController.restrictTo('admin'),
//     memberController.deleteMember
//   )
//   .post(
//     authController.protect,
//     authController.restrictTo('admin'),
//     memberController.updateMember
//   );

module.exports = router;
