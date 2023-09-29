const mongoose = require("mongoose");

// 1- Create Schema
const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Product name required"],
      minlength: [3, "Too short product name"],
      maxlength: [32, "Too long product name"],
    },
    description: {
      type: String,
      required: [true, "Product type required"],
      minlength: [3, "Too short product name"],
      maxlength: [32, "Too long product name"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    quantity: {
      type: Number,
      default: 1,
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],
      trim: true,
      max: [200000, "Too long product price"],
    },

    image: String,

    duration: {
      type: Number,
      min: [0, "Add a valid number"],
    },
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
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "Baker",
      min: [1, "Rating must be above or equal 1.0"],
      max: [5, "Rating must be below or equal 5.0"],
      required: [true, "Sign in as a baker"],
    },
    location: {
      type: String,
      required: [true, "Add your Location"],
    },
  },

  {
    timestamps: true,
    // to enable virtual populate
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// to review product reviews
productSchema.virtual("reviews", {
  ref: "Baker",
  foreignField: "product",
  localField: "_id",
});

const setImageURL = (doc) => {
  if (doc.imageCover) {
    const imageUrl = `${process.env.BASE_URL}/products/${doc.imageCover}`;
    doc.imageCover = imageUrl;
  }
  if (doc.images) {
    const imagesList = [];
    doc.images.forEach((image) => {
      const imageUrl = `${process.env.BASE_URL}/products/${image}`;
      imagesList.push(imageUrl);
    });
    doc.images = imagesList;
  }
};

// get all , update , get specific
productSchema.post("init", (doc) => {
  setImageURL(doc);
});

// create
productSchema.post("save", (doc) => {
  setImageURL(doc);
});

// 2- Create model
module.exports = mongoose.model("Product", productSchema);
