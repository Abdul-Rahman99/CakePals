const express = require("express");

const {
  createReviewValidator,
  updateReviewValidator,
  getReviewValidator,
  deleteReviewValidator,
} = require("../utils/validators/reviewBakerValidator");

const {
  getReview,
  getReviews,
  createReview,
  updateReview,
  deleteReview,
  createFilterObj,
  setProductIdAndUserIdToBody,
} = require("../services/reviewBakerService");

const authMemberService = require("../services/authMemberService");

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .post(
    authMemberService.protect,
    setProductIdAndUserIdToBody,
    createReviewValidator,
    createReview
  );

router.route("/:productId/reviews").get(createFilterObj, getReviews);

router
  .route("/:id")
  .get(getReviewValidator, getReview)
  .put(authMemberService.protect, updateReviewValidator, updateReview)
  .delete(authMemberService.protect, deleteReviewValidator, deleteReview);

module.exports = router;
