const mongoose = require('mongoose');

const pupSchema = new mongoose.Schema({
  header: {
    type: String,
    trim: true,
    required: [true, `A puppy info must have a header.`],
  },
  description: {
    type: String,
    required: [true, `A puppy info must have a description.`],
  },
  date: {
    type: Date,
    required: [true, `A puppy info must have a date.`],
  },
});

const Pup = mongoose.model('Pup', pupSchema);

module.exports = Pup;
