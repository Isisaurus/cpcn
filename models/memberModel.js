const mongoose = require('mongoose');
const validator = require('validator');
const mongooseTypePhone = require('mongoose-type-phone');

const familyMember = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, `A family member must have a first name.`],
  },
  lastName: {
    type: String,
    required: [true, `A family member must have a last name.`],
  },
  dateOfBirth: {
    type: Date,
    required: [true, `A family member must have a date of birth.`],
  },
});

const dogMember = new mongoose.Schema({
  nickname: {
    type: String,
    required: [true, `A dog must have a name.`],
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
  familyTree: {
    type: String,
  },
  familyTreeNumber: {
    type: String,
  },
});

const memberSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, `First name is required.`],
  },
  lastName: {
    type: String,
    required: [true, `Last name is required.`],
  },
  dateOfBirth: {
    type: Date,
    required: [true, `Date of birth is required.`],
  },
  email: {
    type: String,
    required: [true, `Email is required.`],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, `Please, provide a valid email!`],
  },
  address: {
    country: {
      type: String,
      required: [true, `Country is required.`],
    },
    city: {
      type: String,
      required: [true, `City is required.`],
    },
    postcode: {
      type: String,
      required: [true, `Postcode is required.`],
    },
    street: {
      type: String,
      required: [true, `Street and house number is required.`],
    },
  },
  phone: {
    type: String,
    required: [true, `Phone number is required.`],
  },
  familyMembers: [familyMember],
  dogs: [dogMember],
  validated: {
    type: Boolean,
    default: false,
  },
  fee: {
    type: Number,
    required: [true, `Fee is required.`],
  },
  joinedAt: {
    type: Date,
    required: [true, `Join date is required.`],
  },
});

const Member = mongoose.model('Member', memberSchema);
module.exports = Member;
