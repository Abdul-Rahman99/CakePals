const factory = require("./handlersFactory");
const Review = require("../models/reviewProductModel");

// Nested route
// GET /api/v1/reviewsProduct/:productId/reviews
exports.createFilterObj = (req, res, next) => {
  let filterObject = {};
  if (req.params.productId) filterObject = { product: req.params.productId };
  req.filterObj = filterObject;
  next();
};

// @desc    Get list of reviews for a product
// @route   GET /api/v1/reviewsProduct
// @access  Public/guest-member-baker
exports.getReviews = factory.getAll(Review);

// @desc    Get specific review by id
// @route   GET /api/v1/reviewsProduct/:id
// @access  Public/guest-member-baker
exports.getReview = factory.getOne(Review);

// Nested route (Create) if there is no req comes from body.product let it be req from params.productId that comes from nested route
// if there is no req comes from body.user let it be req.user._id from  the nested route
exports.setProductIdAndUserIdToBody = (req, res, next) => {
  if (!req.body.product) req.body.product = req.params.productId;
  if (!req.body.user) req.body.user = req.user._id;
  next();
};

// @desc    Create review for a product
// @route   POST  /api/v1/reviewsProduct
// @access  Private/Protect/member
exports.createReview = factory.createOne(Review);

// @desc    Update specific review for a product
// @route   PUT /api/v1/reviewsProduct/:id
// @access  Private/Protect/member
exports.updateReview = factory.updateOne(Review);

// @desc    Delete specific review for a product
// @route   DELETE /api/v1/reviewsProduct/:id
// @access  Private/Protected/member
exports.deleteReview = factory.deleteOne(Review);
