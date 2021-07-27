const mongoose = require('mongoose');
const slugify = require('slugify');

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, `An event must have a name.`],
      unique: true,
      trim: true,
      maxlength: [40, `The title must be under 40 characters.`],
      minlength: [5, `The title must be over 5 characters.`],
    },
    slug: String,
    startsAt: {
      type: Date,
      required: [true, `An event must have a starting date and time.`],
    },
    endsAt: {
      type: Date,
      required: [true, `An event must have an ending date and time.`],
    },
    locationUrl: {
      type: String,
      required: [true, `An event must have a location URL.`],
    },
    location: {
      type: String,
      required: [true, `An event must have a location.`],
    },
    description: {
      type: String,
      required: [true, `An event must have a description.`],
    },
    clubEvent: {
      type: Boolean,
      default: false,
      select: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

//runs before create and save command
//creating slug based on event name
eventSchema.pre('save', function (next) {
  this.slug = slugify(this.title, { lower: true });
  next();
});
//query middleware, runs before find query
eventSchema.pre(/^find/, function (next) {
  this.find({ clubEvent: { $ne: true } });
  next();
});

eventSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { clubEvent: { $ne: true } } });
  next();
});
const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
