const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');

const compression = require('compression');
const cors = require('cors');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const userRouter = require('./routes/userRoutes');
const dogRouter = require('./routes/dogRoutes');
const pupRouter = require('./routes/pupRoutes');
const eventRouter = require('./routes/eventRoutes');
const memberRouter = require('./routes/memberRoutes');
const membershipRouter = require('./routes/membershipRoutes');
const viewRouter = require('./routes/viewRoutes');

//Add express methods to app
const app = express();

// trust proxies: heroku - built in express
app.enable('trust proxy');

// Add Pug templating view engine
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// CORS - adds specific info to headers so others can access the API open data for simple requests
// sets Access-Control-Allow-Origin to value *
// in case the front-end gets separated, adjust to:
// app.use(cors({
//   origin: 'https://somethingsomething.com'
// }))
app.use(cors());
// CORS for complex requests
app.options('*', cors());

// serving static files
app.use(express.static(path.join(__dirname, 'public')));

// set security HTTP headers
app.use(helmet());

/////////////////////////////////////////////////////////Middlewares
//middleware to log request data into console when in development
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
// set rate-limiting for security
const limiter = rateLimit({
  max: 200,
  windowMs: 60 * 60 * 1000,
  message: `Too many requests from this IP, please try again in an hour!`,
});
app.use('/api', limiter);

//middleware to add data to req.body
app.use(
  express.json({
    limit: '10kb',
  })
);
// sending post req with form (reads props from url)
app.use(
  express.urlencoded({
    extended: true,
    limit: '10kb',
  })
);
//cookie parser
app.use(cookieParser());

// data senitization against noSQL query injection
app.use(mongoSanitize());
// data sanitization against XSS
app.use(xss());
// prevent parameter pollution for security -> cleans up query string
app.use(
  hpp({
    whitelist: [],
  })
);

// compress req, res using compress package
app.use(compression());

// middleware to add timestamp TEST
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// routers
app.use('/', viewRouter);
app.use('/api/v1/dogs', dogRouter);
app.use('/api/v1/pups', pupRouter);
app.use('/api/v1/events', eventRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/members', memberRouter);
app.use('/api/v1/membership', membershipRouter);

//handling unhandled routes
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
