const Member = require('./../models/memberModel');
const factory = require('./handlerFactory');
const catchAsync = require('./../utils/catchAsync');
const Email = require('./../utils/email');

exports.getAllMembers = factory.getAll(Member);
exports.deleteMember = factory.deleteOne(Member);
exports.updateMember = factory.updateOne(Member);

exports.createMember = catchAsync(async (req, res, next) => {
  const newMember = await req.body;

  // console.log(newMember);

  await new Email(newMember)
    .sendDetails(newMember)
    .then(() => {
      new Email(newMember).sendWelcome(newMember);
    })
    .catch((err) => {
      throw err;
    });

  res.status(201).json({
    status: 'Success',
    data: null,
  });
});
