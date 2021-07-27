const User = require('./../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const multer = require('multer');
const fs = require('fs');

// upload images to gallery middleware

//save files as it is in file system
const multerStorage = multer.diskStorage({
  // has access to req, the file and a callback which is similar to next(), can pass in err
  destination: (req, file, cb) => {
    cb(null, 'public/img/gallery');
  },
  filename: (req, file, cb) => {
    //custom filename with the user id and timestamp of upload
    // who uploaded it and when?
    // img-252572dsvds-65554244.jpeg
    const extension = file.mimetype.split('/')[1];

    cb(null, `image-${Date.now()}.${extension}`);
  },
});

// filter for file extension: is the uploaded file an img?
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images.', 400), false);
  }
};

// configuration
const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

// image is name of the field
exports.uploadGalleryImage = upload.single('image');
// returns * route not found fail res
// middleware to run after
// still fails if something is wrong
exports.uploadedImg = catchAsync(async (req, res, next) => {
  const newImg = {
    src: req.file.filename,
  };

  const imgTitlesJSON = fs.readFileSync(
    `${__dirname}./../public/img/gallery/image_titles.json`
  );

  const imgTitles = JSON.parse(imgTitlesJSON);

  imgTitles.push(newImg);

  const newJSON = JSON.stringify(imgTitles);

  fs.writeFile(
    `${__dirname}./../public/img/gallery/image_titles.json`,
    newJSON,
    (err) => {
      if (err) {
        next(new AppError(`Problem writting to file.`, 400));
      } else {
        res.status(200).json({
          status: 'success',
        });
      }
    }
  );
});

// resize photos ?
// exports.resizeImg = (req, res, next) => {
//   if (!req.file) return next();

//   // user sharp package to resize images
// };
