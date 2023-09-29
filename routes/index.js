const productsRoute = require("./productRoute");
const bakerRoute = require("./bakerRoute");
const memberRoute = require("./memberRoute");

const authBakerRoute = require("./authBakerRoute");
const authMemberRoute = require("./authMemberRoute");
const reviewsProductRoute = require("./reviewProductRoute");
const reviewsBakerRoute = require("./reviewBakerRoute");
const ordersRoute = require("./ordersRoute");

const mountRoutes = (app) => {
  app.use("/api/v1/products", productsRoute);

  app.use("/api/v1/member", memberRoute);
  app.use("/api/v1/baker", bakerRoute);

  app.use("/api/v1/authBaker", authBakerRoute);
  app.use("/api/v1/authMember", authMemberRoute);

  app.use("/api/v1/reviewsProduct", reviewsProductRoute);
  app.use("/api/v1/reviewsBaker", reviewsBakerRoute);
  app.use("/api/v1/orders", ordersRoute);
};

module.exports = mountRoutes;
