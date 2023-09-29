const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  // Reference to the product being ordered
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },

  // Reference to the user (member or guest) who placed the order
  user: { type: mongoose.Schema.Types.ObjectId, ref: "Member" },

  // Reference to the baker who will fulfill the order
  baker: { type: mongoose.Schema.Types.ObjectId, ref: "Baker", required: true },

  // The status that order will be assumed to be
  status: {
    type: String,
    enum: ["pending", "accepted", "rejected", "fulfilled"],
    default: "pending",
  },
  review: {
    type: String,
    default: null, // Initial review is null, indicating not yet reviewed
  },

  // Payment method (e.g., 'credit card', 'PayPal')
  paymentMethod: { type: String, required: true, default: "cash" },

  isPaid: {
    type: Boolean,
    default: false,
  },
  paymentDate: {
    type: Date,
    default: null,
  },
  price: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  // Price of the product at the time of order placement
});

// Middleware to calculate the end time based on the selected product's duration
orderSchema.pre("save", async function (next) {
  if (!this.isNew || !this.product) {
    return next();
  }

  const product = await mongoose.model("Product").findById(this.product);
  if (!product) {
    return next();
  }

  const endTime = new Date();
  endTime.setMinutes(endTime.getMinutes() + product.duration);
  this.endTime = endTime;

  next();
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
