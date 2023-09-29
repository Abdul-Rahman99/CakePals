const factory = require("./handlersFactory");
const ReviewBakerModel = require("../models/reviewBakerModel");

// Nested route
// GET /api/v1/products/:productId/reviews
exports.createFilterObj = (req, res, next) => {
  let filterObject = {};
  if (req.params.bakerId) filterObject = { baker: req.params.bakerId };
  req.filterObj = filterObject;
  next();
};

// @desc    Get list of reviews of the baker
// @route   GET /api/v1/reviewsBaker
// @access  Public/member-baker
exports.getReviews = factory.getAll(ReviewBakerModel);

// @desc    Get specific review by id for baker
// @route   GET /api/v1/reviewsBaker/:id
// @access  Public/guest-member-baker
exports.getReview = factory.getOne(ReviewBakerModel);

// Nested route (Create) if there is no req comes from body.product let it be req from params.productId that comes from nested route
// if there is no req comes from body.user let it be req.user._id from  the nested route
exports.setProductIdAndUserIdToBody = (req, res, next) => {
  if (!req.body.baker) req.body.baker = req.params.bakerId;
  if (!req.body.user) req.body.user = req.user._id;
  next();
};
// @desc    Create review for a baker
// @route   POST  /api/v1/reviewsBaker/:prodyctId/reviews
// @access  Private/Protect/member
exports.createReview = factory.createOne(ReviewBakerModel);

// @desc    Update specific review for a baker
// @route   PUT /api/v1/reviewsBaker/:id
// @access  Private/Protect/member
exports.updateReview = factory.updateOne(ReviewBakerModel);

// @desc    Delete specific review
// @route   DELETE /api/v1/reviewsBaker/:id
// @access  Private/Protected/member
exports.deleteReview = factory.deleteOne(ReviewBakerModel);
