const mongoose = require("mongoose");
const Baker = require("./bakerModel");

const ReviewBakerSchema = new mongoose.Schema(
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
    baker: {
      type: mongoose.Schema.ObjectId,
      ref: "Baker",
      required: [true, "Review must be to a Baker"],
    },
  },
  {
    timestamps: true,
    // to enable virtual populate
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

ReviewBakerSchema.pre(/^find/, function (next) {
  this.populate({ path: "user", select: "name" });
  next();
});

ReviewBakerSchema.statics.calcAverageRatingsAndQuantity = async function (
  bakerId
) {
  const result = await this.aggregate([
    // Stage 1 : get all reviews in specific product
    {
      $match: { baker: bakerId },
    },
    // Stage 2: Grouping reviews based on productID and calc avgRatings, ratingsQuantity
    {
      $group: {
        _id: "baker",
        avgRatings: { $avg: "$ratings" },
        ratingsQuantity: { $sum: 1 },
      },
    },
  ]);

  // console.log(result);
  if (result.length > 0) {
    await Baker.findByIdAndUpdate(bakerId, {
      ratingsAverage: result[0].avgRatings,
      ratingsQuantity: result[0].ratingsQuantity,
    });
  } else {
    await Baker.findByIdAndUpdate(bakerId, {
      ratingsAverage: 0,
      ratingsQuantity: 0,
    });
  }
};

ReviewBakerSchema.post("save", async function () {
  await this.constructor.calcAverageRatingsAndQuantity(this.baker);
});

ReviewBakerSchema.post("remove", async function () {
  await this.constructor.calcAverageRatingsAndQuantity(this.baker);
});

const ReviewBakerModel = mongoose.model("ReviewBakerModel", ReviewBakerSchema    );

module.exports = ReviewBakerModel;
