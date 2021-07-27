const mongoose = require('mongoose');
// fot nodejs to see environment variables inside config.env
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const app = require('./app');

// catching (a)synchronos errors
process.on('uncaughtException', (err) => {
  console.log(err.name, err.message);
  console.log(`Uncaught Exception! 💥💥💥 Shutting down...`);
  server.close(() => {
    process.exit(1);
  });
});

/////////////////////////////////////////////////////////connect to DB
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);
mongoose.connect(DB, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

/////////////////////////////////////////////////////////Simple server setup
const port = process.env.PORT || 8000;
const server = app.listen(port, () => {
  console.log(`App running on port: ${port}.`);
});

process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log(`Unhandled Rejection! 💥💥💥 Shutting down...`);
  server.close(() => {
    process.exit(1);
  });
});

process.on('SIGTERM', (err) => {
  console.log('SIGTERM recieved! 💥💥💥 Shutting down gracefully!');
  server.close(() => {
    console.log('💥 Process terminated by Heroku!');
  });
});
