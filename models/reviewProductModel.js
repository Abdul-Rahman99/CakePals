const mongoose = require("mongoose");
const Product = require("./productModel");

const reviewProductSchema = new mongoose.Schema(
  {
    title: {
      type: String,
    },
    ratings: {
      type: Number,
      min: [1, "Min ratings value is 1.0"],
      max: [5, "Max ratings value is 5.0"],
      required: [true, "review ratings required"],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "Member",
      required: [true, "Review must belong to member"],
    },

    // parent references (one to many)
    product: {
      type: mongoose.Schema.ObjectId,
      ref: "Product",
      required: [true, "Review must belong to product"],
    },
  },
  { timestamps: true }
);

reviewProductSchema.pre(/^find/, function (next) {
  this.populate({ path: "user", select: "name" });
  this.populate({ path: "product", select: "name" });
  next();
});

reviewProductSchema.statics.calcAverageRatingsAndQuantity = async function (
  productId
) {
  const result = await this.aggregate([
    // Stage 1 : get all reviews on specific product
    {
      $match: { product: productId },
    },
    // Stage 2: Grouping reviews based on productID and calc avgRatings, ratingsQuantity
    {
      $group: {
        _id: "product",
        avgRatings: { $avg: "$ratings" },
        ratingsQuantity: { $sum: 1 },
      },
    },
  ]);

  // console.log(result);
  if (result.length > 0) {
    await Product.findByIdAndUpdate(productId, {
      ratingsAverage: result[0].avgRatings,
      ratingsQuantity: result[0].ratingsQuantity,
    });
  } else {
    await Product.findByIdAndUpdate(productId, {
      ratingsAverage: 0,
      ratingsQuantity: 0,
    });
  }
};

reviewProductSchema.post("save", async function () {
  await this.constructor.calcAverageRatingsAndQuantity(this.product);
});

reviewProductSchema.post("remove", async function () {
  await this.constructor.calcAverageRatingsAndQuantity(this.product);
});

module.exports = mongoose.model("Review", reviewProductSchema);
