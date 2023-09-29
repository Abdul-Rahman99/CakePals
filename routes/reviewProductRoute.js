const express = require("express");

const {
  createReviewValidator,
  updateReviewValidator,
  getReviewValidator,
  deleteReviewValidator,
} = require("../utils/validators/reviewProductValidator");

const {
  getReview,
  getReviews,
  createReview,
  updateReview,
  deleteReview,
  createFilterObj,
  setProductIdAndUserIdToBody,
} = require("../services/reviewProductService");

const authMemberService = require("../services/authMemberService");

const router = express.Router({ mergeParams: true });

router
  .route("/:productId/reviews")
    .get(createFilterObj, getReviews)

router
  .route("/")
  .post(
    authMemberService.protect,
    setProductIdAndUserIdToBody,
    createReviewValidator,
    createReview
  );
router
  .route("/:id")
  .get(getReviewValidator, getReview)
  .put(authMemberService.protect, updateReviewValidator, updateReview)
  .delete(authMemberService.protect, deleteReviewValidator, deleteReview);

module.exports = router;
