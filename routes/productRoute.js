const express = require("express");
const {
  getProductValidator,
  createProductValidator,
  updateProductValidator,
  deleteProductValidator,
} = require("../utils/validators/productValidator");

const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadProductImage,
  resizeImage,
  filteringVar,
} = require("../services/productService");

const authBakerService = require("../services/authBakerService");
const reviewsRoute = require("./reviewProductRoute");

const router = express.Router();

// @desc  Nested Route for products reviews
// POST   /products/:id/reviews
// GET    /products/:id/reviews
// GET    /products/:id/reviews/:id
router.use("/:productId/reviews", reviewsRoute);

router
  .route("/")
  .get(getProducts) // get non filtered products
  .post(
    authBakerService.protect,
    uploadProductImage,
    resizeImage,
    createProductValidator,
    createProduct
  );

router.get("/filter", filteringVar);

router
  .route("/:id")
  .get(getProductValidator, getProduct)
  .put(
    authBakerService.protect,
    uploadProductImage,
    resizeImage,
    updateProductValidator,
    updateProduct
  )
  .delete(authBakerService.protect, deleteProductValidator, deleteProduct);

module.exports = router;
