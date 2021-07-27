const Pup = require('./../models/pupModel');
const factory = require('./handlerFactory');

exports.latest = (req, res, next) => {
  req.query.sort = '-date';
  req.query.limit = 3;
  next();
};

exports.getAllPups = factory.getAll(Pup);
exports.getPup = factory.getOne(Pup);
exports.createPup = factory.createOne(Pup);
exports.updatePup = factory.updateOne(Pup);
exports.deletePup = factory.deleteOne(Pup);
