const asyncHandler = require("express-async-handler");
const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");

const factory = require("./handlersFactory");
const Product = require("../models/productModel");
const productService = require("../services/productService")
const { uploadSingleImage } = require("../middlewares/uploadImageMiddleware");

exports.uploadProductImage = uploadSingleImage("image");

exports.resizeImage = asyncHandler(async (req, res, next) => {
  const filename = `product-${uuidv4()}-${Date.now()}.jpeg`;

  if (req.file) {
    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat("jpeg")
      .jpeg({ quality: 95 })
      .toFile(`uploads/products/${filename}`);
  }

  // save image into DB
  req.body.image = filename;

  next();
});

// @desc    Get list of Products
// @route   GET /api/v1/Products
// @access  Public
exports.getProducts = factory.getAll(Product);

// @desc    Get specific Product by id
// @route   GET /api/v1/Products/:id
// @access  Public
exports.getProduct = factory.getOne(Product);

// @desc    Create Product
// @route   POST  /api/v1/Products
// @access  Private
exports.createProduct = factory.createOne(Product);

// @desc    Update specific Product
// @route   PUT /api/v1/Products/:id
// @access  Private
exports.updateProduct = factory.updateOne(Product);

// @desc    Delete specific Product
// @route   DELETE /api/v1/Products/:id
// @access  Private
exports.deleteProduct = factory.deleteOne(Product);



function filterProducts(products, location, type) {
  let filteredProducts = [...products];

  if (location) {
    filteredProducts = filteredProducts.filter(
      (product) => product.location === location
    );
  }

  if (type) {
    filteredProducts = filteredProducts.filter(
      (product) => product.type === type
    );
  }

  return filteredProducts;
}
exports.filteringVar = asyncHandler(async (req, res) => {
  const { location, type } = req.query;

  // Fetch all products
  const allProducts = productService.getProducts;
  // Filter products based on user input
  const filtered = productService.filterProducts(allProducts, location, type);
  res.status(200).json({ data: filtered });
});
