const Membership = require('./../models/membershipModel');

const factory = require('./handlerFactory');

exports.getAllFees = factory.getAll(Membership);
exports.updateFee = factory.updateOne(Membership);
