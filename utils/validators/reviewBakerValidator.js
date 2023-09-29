const { check } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const ReviewBakerModel = require("../../models/reviewBakerModel");

exports.createReviewValidator = [
  check("title"),
  check("ratings")
    .notEmpty()
    .withMessage("ratings value required")
    .isFloat({ min: 1, max: 5 })
    .withMessage("Ratings value must be between 1 to 5"),
  check("user").isMongoId().withMessage("Invalid user id format"),
  check("baker")
    .isMongoId()
    .withMessage("Invalid baker id format")
    .custom((val, { req }) =>
      // Check if logged user create review before
      ReviewBakerModel.findOne({
        user: req.user._id,
        product: req.body.product,
      }).then((review) => {
        console.log(review);
        if (review) {
          return Promise.reject(
            new Error("You already created a review before fo this baker")
          );
        }
      })
    ),
  validatorMiddleware,
];

exports.getReviewValidator = [
  check("id").isMongoId().withMessage("Invalid Review id format"),
  validatorMiddleware,
];

exports.updateReviewValidator = [
  check("id")
    .isMongoId()
    .withMessage("Invalid Review id format")
    .custom((val, { req }) =>
      // Check review ownership before update
      ReviewBakerModel.findById(val).then((review) => {
        if (!review) {
          return Promise.reject(new Error(`There is no review with id ${val}`));
        }

        if (review.user._id.toString() !== req.user._id.toString()) {
          return Promise.reject(
            new Error(`Your are not allowed to perform this action`)
          );
        }
      })
    ),
  validatorMiddleware,
];

exports.deleteReviewValidator = [
  check("id").isMongoId().withMessage("Invalid Review id format"),
  validatorMiddleware,
];
