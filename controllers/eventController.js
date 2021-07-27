const { json } = require('express');
const AppError = require('../utils/appError');
const Event = require('./../models/eventModel');

const catchAsync = require('./../utils/catchAsync');
const factory = require('./handlerFactory');

exports.upcoming = (req, res, next) => {
  req.query.sort = 'startsAt';
  req.query.limit = 3;
  next();
};

exports.getAllEvents = factory.getAll(Event);
exports.createEvent = factory.createOne(Event);
exports.getEventByID = factory.getOne(Event);
exports.updateEventByID = factory.updateOne(Event);
exports.deleteEventByID = factory.deleteOne(Event);

exports.getEventStats = catchAsync(async (req, res, next) => {
  const year = +req.params.year;
  const stats = await Event.aggregate([
    {
      $match: {
        startsAt: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$startsAt' },
        numEventStarts: { $sum: 1 },
        events: { $push: '$title' },
      },
    },
    {
      $addFields: { month: '$_id' },
    },
    {
      $project: {
        _id: 0,
      },
    },
    {
      $sort: { numEventStarts: -1 },
    },
  ]);

  res.status(200).json({
    status: 'Success',
    data: {
      stats,
    },
  });
});
