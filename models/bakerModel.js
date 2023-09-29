const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const bakerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Your Name is required"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    email: {
      type: String,
      required: [true, "Your Email is required"],
      unique: true,
      lowercase: true,
    },

    currentOrder: {
      order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
        default: null,
      },
      endTime: Date,
    },
    product: {
      type: mongoose.Schema.ObjectId,
      ref: "Product",
    },

    phone: String,
    profileImg: String,

    password: {
      type: String,
      required: [true, "Please add Password"],
      minlength: [6, "Too short password"],
    },
    passwordChangedAt: Date,
    passwordResetCode: String,
    passwordResetExpires: Date,
    passwordResetVerified: Boolean,

    active: {
      type: Boolean,
      default: true,
    },
    addresses: [
      {
        id: { type: mongoose.Schema.Types.ObjectId },
        alias: String,
        details: String,
        phone: String,
        city: String,
        postalCode: String,
      },
    ],
    ratingsAverage: {
      type: Number,
      min: [1, "Rating must be above or equal 1.0"],
      max: [5, "Rating must be below or equal 5.0"],
      // set: (val) => Math.round(val * 10) / 10, // 3.3333 * 10 => 33.333 => 33 => 3.3
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
  },

  {
    timestamps: true,
    // to enable virtual populate
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// to review baker's ratings
bakerSchema.virtual("reviews", {
  ref: "ReviewBakerModel",
  foreignField: "baker",
  localField: "_id",
});

bakerSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  // Hashing user password
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

const Baker = mongoose.model("Baker", bakerSchema);

module.exports = Baker;
