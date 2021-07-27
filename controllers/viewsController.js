const nodemailer = require('nodemailer');
const Event = require('../models/eventModel');
const Pup = require('../models/pupModel');
const Dog = require('./../models/dogModel');
const User = require('./../models/userModel');
const Member = require('./../models/memberModel');
const Membership = require('./../models/membershipModel');
const catchAsync = require('../utils/catchAsync');
const fs = require('fs');
const AppError = require('../utils/appError');
const Email = require('./../utils/email');

const readJson = async (fileName) => {
  return new Promise((resolve, reject) => {
    fs.readFile(
      `${__dirname}/../public/data/${fileName}.json`,
      'utf-8',
      (err, text) => {
        if (err) {
          reject(err);
        }
        resolve(text);
      }
    );
  });
};

const readText = async (fileName) => {
  return new Promise((resolve, reject) => {
    fs.readFile(
      `${__dirname}/../public/text/${fileName}.txt`,
      'utf-8',
      (err, text) => {
        if (err) {
          reject(err);
        }
        resolve(text);
      }
    );
  });
};

exports.getHome = catchAsync(async (req, res, next) => {
  const currentDate = new Date(Date.now());
  const eventQuery = [
    {
      $match: {
        startsAt: {
          $gte: currentDate,
        },
      },
    },
    {
      $sort: {
        startsAt: 1,
      },
    },
    {
      $limit: 3,
    },
  ];
  // get data
  const events = await Event.aggregate(eventQuery);
  //TEST FOR ERROR HANDLING
  // const events = undefined;
  // build template
  const pups = await Pup.find().sort('-date').limit(3);
  // TEST FOR ERROR HANDLING
  // const pups = undefined;

  let pupNotFoundMessage = '';
  let eventsNotFoundMessage = '';

  //error handling
  if (!events) {
    eventsNotFoundMessage = `No upcoming events.`;
  }
  if (!pups) {
    pupNotFoundMessage = `No kennel news.`;
  }
  if (events && events.length === 0) {
    eventsNotFoundMessage = `No upcoming events.`;
  }
  if (pups && pups.length === 0) {
    pupNotFoundMessage = `No upcoming events.`;
  }

  // render template using the data from before
  res.status(200).render('home', {
    title: 'Home',
    events,
    pups,
    pupNotFoundMessage,
    eventsNotFoundMessage,
  });
});

exports.getClub = catchAsync(async (req, res, next) => {
  const currentDate = new Date(Date.now());
  const eventQuery = [
    {
      $match: {
        startsAt: {
          $gte: currentDate,
        },
      },
    },
    {
      $sort: {
        startsAt: 1,
      },
    },
  ];
  // get data
  const events = await Event.aggregate(eventQuery);
  const boardData = await readJson('board');
  const boardMembers = await JSON.parse(boardData);

  // render template using the data from before
  res.status(200).render('cpcn', {
    title: 'CPCN',
    events,
    boardMembers,
  });
});

exports.getFokken = catchAsync(async (req, res, next) => {
  res.status(200).render('fokken', {
    title: 'Fokken',
  });
});

exports.getKennels = catchAsync(async (req, res, next) => {
  const kennelsObj = await readJson('kennels');
  const kennels = await JSON.parse(kennelsObj);
  const dogs = await Dog.find();
  res.status(200).render('kennels', {
    title: 'Kennel Info',
    kennels,
    dogs,
  });
});

exports.getLoginForm = catchAsync(async (req, res, next) => {
  res.status(200).render('login', {
    title: 'Log into your account',
  });
});

exports.getGallery = catchAsync(async (req, res, next) => {
  res.status(200).render('gallery', {
    title: 'Gallery',
  });
});

exports.getChodksypes = catchAsync(async (req, res, next) => {
  const history = await readText('geschiedenis');
  const character = await readText('karakter');
  const characteristics = await readText('raskenmerken');
  const health = await readText('gezondheid');
  res.status(200).render('chodskypes', {
    title: 'Chodsky Pes',
    history,
    character,
    characteristics,
    health,
  });
});

exports.getPups = catchAsync(async (req, res, next) => {
  const pups = await Pup.find().sort('-date');
  res.status(200).render('pups', {
    title: 'Pupinfo',
    pups,
  });
});

// admin page
exports.getAdmin = catchAsync(async (req, res) => {
  const pups = await Pup.find();
  const events = await Event.find();
  const members = await Member.find();
  const fees = await Membership.find();
  res.status(200).render('administration', {
    title: 'Administration',
    pups,
    events,
    members,
    fees,
  });
});

exports.getJoin = catchAsync(async (req, res) => {
  const text = await readText('lidworden');
  res.status(200).render('join', {
    title: 'Join Us',
    text,
  });
});

// only to update email address from front-end
// not the best for error handling
exports.updateUserData = catchAsync(async (req, res, next) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    {
      email: req.body.email,
    },
    {
      new: true,
      runValidators: true,
    }
  );
  const pups = await Pup.find();
  const events = await Event.find();
  const members = await Member.find();
  const fees = await Membership.find();
  res.status(200).render('administration', {
    title: 'Administration',
    pups,
    events,
    members,
    fees,
    user: updatedUser,
  });
});

exports.sendFooterMessage = catchAsync(async (req, res, next) => {
  // console.log(`in sendFooterMessage at backend!`);
  // console.log(req.body);
  const sender = req.body;

  // TEST catch
  await new Email(sender).contact(sender).catch((err) => {
    console.log(err);
  });

  res.status(201).json({
    status: 'Success',
    data: null,
  });
});
