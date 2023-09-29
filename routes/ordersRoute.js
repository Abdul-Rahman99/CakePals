const express = require("express");

const {
  placeOrder,
  orderPaymentCash,
  bakerOrders,
  acceptOrders,
  rejectOrder,
  fulfilledOrder,
  reviewOrder,
  createFilterObj,
  setProductIdAndUserIdToBody,
  availableBakers,
} = require("../services/orderService");

const authBakerService = require("../services/authBakerService");
const authMemberService = require("../services/authMemberService");

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(availableBakers)
  .post(authMemberService.protect, placeOrder) // only members can place an orders
  .put(authBakerService.protect , orderPaymentCash) // only bakers can confirm payment is done
  .get(authBakerService.protect, bakerOrders);

// @desc  Nested Route for fulfilled orders reviews
// POST   /orders/:id/reviews
// GET    /orders/:id/reviews
// GET    /orders/:id/reviews/:id
router.use(
  "/:orderId/reviews",
  createFilterObj,
  setProductIdAndUserIdToBody,
  reviewOrder
);

router
  .route("/:id")
  .put(authBakerService.protect, acceptOrders, rejectOrder, fulfilledOrder);

module.exports = router;
