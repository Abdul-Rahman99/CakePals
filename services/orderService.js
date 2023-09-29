const asyncHandler = require("express-async-handler");

const ApiError = require("../utils/apiError");
const ApiFeatures = require("../utils/apiFeatures");

const Order = require("../models/orderModel");
const Product = require("../models/productModel");


// @desc    Place an order from Member or guest
// @route   GET /api/v1/orders
// @access  Protected/member
exports.placeOrder = asyncHandler(async (req, res, next) => {
  const { productId, userId } = req.body;
  const product = await Product.findById(productId);
  if (!product) {
    return res.status(404).json({ error: "Product not found." });
  }

  // Find an available baker (one without a current order)
  const availableBaker = await Baker.findOne({ "currentOrder.order": null });

  if (!availableBaker) {
    return next(new ApiError("There is no available baker at the moment", 400));
  }

  // Calculate the end time based on the selected product's duration
  const endTime = new Date();
  endTime.setMinutes(endTime.getMinutes() + product.duration);

  // Create and save the order, assigning it to the available baker
  const order = new Order({
    product: productId,
    user: userId,
    baker: availableBaker._id,
    status: "pending",
    paymentMethod: "cash",
    price: product.price,
    endTime,
  });
  if (!order) {
    return next(new ApiError(`No document for this id ${id}`, 404));
  }
  res.status(200).json({ message: "Order placed successfully." });

  await order.save();

  // Update the baker's current order
  availableBaker.currentOrder.order = order._id;
  availableBaker.currentOrder.endTime = endTime;
  await availableBaker.save();

  res.status(200).json({ message: "Order successfully placed" });
  next();
});

// @desc    Confirming payment from baker
// @route   GET /api/v1/orders
// @access  Protected/baker
exports.orderPaymentCash = asyncHandler(async (req, res, next) => {
  const { orderId, price } = req.params;
  // Find the order by ID
  const order = await Order.findById(orderId);
  if (!order) {
    return next(new ApiError("Not an ordered product", 404));
  }

  // Mark the order as paid and set the payment date
  order.isPaid = true;
  order.paymentDate = new Date();

  //Update the order's price with the provided price
  order.price = price;

  await order.save();

  res
    .status(201)
    .json({ message: `Payment Succesful your total price is ${order.price}` });
});

// @desc    Get all orders for bakers
// @route   GET /api/v1/orders
// @access  Protected/baker
exports.bakerOrders = asyncHandler(async (req, res, next) => {
  let filter = {};
  if (req.filterObj) {
    filter = req.filterObj;
  }
  // Build query
  const documentsCounts = await Order.countDocuments();
  const apiFeatures = new ApiFeatures(Order.find(filter), req.query)
    .paginate(documentsCounts)
    .filter()
    .search(Order)
    .limitFields()
    .sort();

  // Execute query
  const { mongooseQuery, paginationResult } = apiFeatures;
  const documents = await mongooseQuery;

  // getting all bakers Orders
  const { bakerId } = req.params.bakerId;
  const orders = await Order.find({ baker: bakerId });
  if (!orders) {
    return next(new ApiError(`No order for this id was placed ${id}`, 404));
  }
  res
    .status(200)
    .json({ results: documents.length, paginationResult, data: orders });
});

// @desc    Accept an order from Member by a baker
// @route   GET /api/v1/orders
// @access  Protected/member
exports.acceptOrders = asyncHandler(async (req, res, next) => {
  const { orderId } = req.params.orderId;

  const updatedOrder = await Order.findByIdAndUpdate(
    orderId,
    { status: "accepted" },
    { new: true }
  );
  if (!updatedOrder) {
    return next(new ApiError(`No order for this id was found ${id}`, 404));
  }
  res.status(201).json({ data: updatedOrder });
});

// @desc    Reject an order from Member by a baker
// @route   GET /api/v1/orders
// @access  Protected/baker
exports.rejectOrder = asyncHandler(async (req, res, next) => {
  const { orderId } = req.params.orderId;

  const updatedOrder = await Order.findByIdAndUpdate(
    orderId,
    { status: "rejected" },
    { new: true }
  );
  if (!updatedOrder) {
    return next(new ApiError(`No order for this id was found ${id}`, 404));
  }
  res.status(201).json({ data: updatedOrder });
});

// @desc    Place an order from baker as a fulfilled
// @route   GET /api/v1/orders
// @access  Protected/baker
exports.fulfilledOrder = asyncHandler(async (req, res, next) => {
  const { orderId } = req.params.orderId;

  const updatedOrder = await Order.findByIdAndUpdate(
    orderId,
    { status: "fulfilled" },
    { new: true }
  );
  if (!updatedOrder) {
    return next(new ApiError(`No order for this id was found ${id}`, 404));
  }
  res.status(201).json({ data: updatedOrder });
});

// @desc    Review an order from Member
// @route   GET /api/v1/orders
// @access  Protected/member
exports.reviewOrder = asyncHandler(async (req, res) => {
  const orderId = req.params.orderId;
  const { review } = req.body;

  // Find the order by ID
  const order = await Order.findById(orderId);
  if (!order) {
    return next(new ApiError(`No order for this id was found ${id}`, 404));
  }
  if (order.status !== "fulfilled") {
    return res
      .status(400)
      .json({ error: "You can only review fulfilled orders." });
  }
  order.review = review;
  await order.save();
  res.status(200).json({ message: "Order reviewd successfully." });
});

// Nested route
// GET /api/v1/orders/:productId/reviews
exports.createFilterObj = (req, res, next) => {
  let filterObject = {};
  if (req.params.orderId) filterObject = { order: req.params.orderId };
  req.filterObj = filterObject;
  next();
};

// Nested route (Create) if there is no req comes from body.product let it be req from params.productId that comes from nested route
// if there is no req comes from body.user let it be req.user._id from  the nested route
exports.setProductIdAndUserIdToBody = (req, res, next) => {
  if (!req.body.order) req.body.order = req.params.orderId;
  if (!req.body.user) req.body.user = req.user._id;
  next();
};

// @desc    List all available bakers to the members and guests
// @route   GET /api/v1/orders
// @access  Public
exports.availableBakers = asyncHandler(async (req, res) => {
  const availableBakers = await Baker.find({
    "currentOrder.order": null,
  }).populate("product");
  if (!availableBakers) {
    return res
      .status(404)
      .json({ error: "There is NO available bakers at the moment" });
  }
  res.status(200).json({ data: availableBakers });
});
