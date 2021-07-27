const AppError = require('../utils/appError');

const handleCastErrorDB = (error) => {
  const message = `Invalid ${error.path}: ${error.value}.`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (error) => {
  const key = Object.keys(error.keyValue);
  const value = Object.values(error.keyValue);
  const message = `Duplicate field value of ${key.join('')}: ${value.join(
    ''
  )}. Please try another ${key.join('')}!`;
  return new AppError(message, 400);
};
const handleValidatorErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};
const handleJWTError = (err) =>
  new AppError(`Invalid token. Please log in again!`, 401);

const handleJWTTokenExpiredTokenError = (err) =>
  new AppError(`Token expired. Please log in again!`, 401);

const sendErrDev = (err, req, res) => {
  if (req.originalUrl.startsWith('/api')) {
    res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  } else {
    res.status(err.statusCode).render('error', {
      title: 'Something went wrong.',
      message: err.message,
      code: err.statusCode,
    });
  }
};

const sendErrProd = (err, req, res) => {
  if (req.originalUrl.startsWith('/api')) {
    if (err.isOperational) {
      //trusted error, send message to client
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    }
    console.error(`ERROR 💥: ${err.message}`);

    return res.status(500).json({
      status: 'error',
      message: 'Something went wrong.',
    });
  }
  // for rendered website
  if (err.isOperational) {
    return res.status(err.statusCode).render('error', {
      title: 'Something went wrong.',
      message: err.message,
      code: err.statusCode,
    });
  }
  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong.',
    message: 'Please, try again later!',
    code: err.statusCode,
  });
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrDev(err, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    if (error.code === 11000) {
      error = handleDuplicateFieldsDB(error);
    } else if (err.name === 'CastError') {
      error = handleCastErrorDB(error);
    } else if (err.name === 'ValidationError') {
      error = handleValidatorErrorDB(error);
    } else if (err.name === 'JsonWebTokenError') {
      error = handleJWTError(error);
    } else if (err.name === 'TokenExpiredError') {
      error = handleJWTTokenExpiredTokenError(error);
    }
    sendErrProd(err, req, res);
  }
};
