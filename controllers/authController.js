const crypto = require('crypto');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const { json } = require('express');
const User = require('./../models/userModel');
const catchAsync = require('../utils/catchAsync');
// const sendEmail = require('../utils/email');
const AppError = require('../utils/appError');
const Email = require('./../utils/email');

const signToken = (id) => {
  return jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, req, res) => {
  const token = signToken(user._id);

  // send JWT via cookie when connection is secure (certain header of req needs to be https because of heroku)
  res.cookie('jwt', token, {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpsOnly: true,
    secure: req.secure || req.headers('x-forwarded-proto') === 'https',
  });

  //remove pw from output
  user.password = null;
  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  if (process.env.NODE_ENV === 'development') {
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
      passwordChangedAt: req.body.passwordChangedAt,
    });

    await new Email(newUser).sendWelcome();

    createSendToken(newUser, 201, req, res);
  } else {
    return next(new AppError(`Sorry, this route doesn't exist.`, 404));
  }
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  //check if email, pw
  if (!email || !password)
    return next(new AppError(`Please provide email and password!`, 400));
  //check if user && correct pw

  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError(`Incorrect email or password.`, 401));
  }

  //if everything is ok send token to client
  createSendToken(user, 200, req, res);
});

exports.logout = (req, res) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ status: 'success' });
};

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }
  if (!token)
    return next(
      new AppError(`You are not logged in! Please, log in to get access.`, 401)
    );

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError(`The user belonging to this token no longer exists.`, 401)
    );
  }
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError('Recently changed password. Please, log in again!', 401)
    );
  }
  // adds user data to request obj when logged in
  req.user = currentUser;
  res.locals.user = currentUser;
  next();
});

//only for rendered pages, no errors!
exports.isLoggedIn = async (req, res, next) => {
  if (req.cookies.jwt) {
    try {
      //verifies token
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET
      );

      //check if user still exists
      const currentUser = await User.findById(decoded.id);
      if (!currentUser) {
        return next();
      }
      //check if user rencently changed pw
      if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next();
      }
      // THERE I A LOGGED IN  USER -> render template (sends user var on locals object into pug to access)
      res.locals.user = currentUser;
      return next();
    } catch (err) {
      return next();
    }
  }
  //else just move on
  next();
};

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role))
      return next(
        new AppError(`You don't have permission to perform this action.`, 403)
      );
    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  //get user based on POSTed email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(
      new AppError('There is no user with the email address provided.', 404)
    );
  }
  //generate random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });
  //send it to user's email
  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/resetPassword/${resetToken}`;

  const message = `Forgot yout password? Submit a PATCH request with your new password and passwordConfirm to ${resetURL}. \nIf you didn't forget your password, please ignore this email!`;
  try {
    await new Email(user.email).sendWelcome();
    // await sendEmail({
    //   email: user.email,
    //   subject: 'Your password reset token (valid for 10mins)',
    //   message,
    // });

    res.status(200).json({
      status: 'success',
      message: 'Token sent to email!',
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(new AppError(`There was an error sending the email`, 500));
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  // get user based on token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  // if token has not expired, there is a user, set new password
  if (!user) {
    return next(new AppError(`Token is invalid or has expired.`, 400));
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  user.passwordChangedAt = Date.now();

  await user.save();
  //if everything is ok send token to client
  createSendToken(user, 200, req, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  // get user from collection
  const user = await User.findById(req.user.id).select('+password');
  // ask for current password and check if valid
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new AppError(`Invalid password.`, 401));
  }
  // if valid, update pw
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;

  await user.save();
  // log in user with new pw
  createSendToken(user, 200, req, res);
});
