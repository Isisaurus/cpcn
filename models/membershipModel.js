const mongoose = require('mongoose');

const membershipSchema = new mongoose.Schema({
  fullYearFee: {
    under12: Number,
    registration: Number,
    membership: Number,
    family: Number,
    dog: Number,
  },
  halfYearFee: {
    under12: Number,
    registration: Number,
    membership: Number,
    family: Number,
    dog: Number,
  },
});

const Membership = mongoose.model('Membership', membershipSchema);

// const testMembership = new Membership({
//   fullYearFee: {
//     under12: 0,
//     registration: 5,
//     membership: 25,
//     family: 7.5,
//     dog: 2.5,
//   },
//   halfYearFee: {
//     under12: 0,
//     registration: 5,
//     membership: 15,
//     family: 5,
//     dog: 2.5,
//   },
// });

// testMembership.save();
module.exports = Membership;
