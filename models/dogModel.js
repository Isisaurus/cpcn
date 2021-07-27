const mongoose = require('mongoose');

const dogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, `A dog must have a stud title.`],
    trim: true,
  },
  NL: {
    type: Boolean,
    required: [true, `A dog must have an NL indicator.`],
    default: true,
  },
  location: {
    type: String,
    trim: true,
  },
  kennelName: {
    type: String,
    trim: true,
  },
  nickname: {
    type: String,
    required: [true, `A dog must have a name.`],
    trim: true,
    unique: [true, `A dog must have a unique name.`],
  },
  gender: {
    type: String,
    trim: true,
    required: [true, `A dog must have a gender: female / male.`],
    enum: ['male', 'female'],
  },
  dateOfBirth: {
    type: Date,
    required: [true, `A dog must have a date of birth.`],
  },
  KPCP: {
    type: String,
    required: [true, `A dog must have a KPCP identifier.`],
    trim: true,
  },
  NHSB: {
    type: String,
    trim: true,
  },
  height: {
    type: Number,
    trime: true,
    required: [true, `A dog must have a height.`],
  },
  health: {
    HD: String,
    ED: String,
    DM: String,
    LocusD: String,
    MDR1: String,
    TLV: String,
    EVCO: String,
  },
  email: String,
  image: {
    type: String,
    required: [true, `A dog must have an image.`],
  },
});

const Dog = mongoose.model('Dog', dogSchema);

module.exports = Dog;
