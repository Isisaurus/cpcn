const Dog = require('./../models/dogModel.js');
const factory = require('./handlerFactory');

exports.getAllDogs = factory.getAll(Dog);
exports.getDog = factory.getOne(Dog);
exports.createDog = factory.createOne(Dog);
exports.updateDog = factory.updateOne(Dog);
exports.deleteDog = factory.deleteOne(Dog);
