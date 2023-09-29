const path = require("path");

// Dependancies
const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const cors = require("cors")
const compression = require("compression")

dotenv.config({ path: "config.env" });

const ApiError = require("./utils/apiError");
const globalError = require("./middlewares/errorMiddleware");
const dbConnection = require("./config/database");
const startOrderAvailabilityCheck = require("./config/startOrderAvailabilityCheck");

// Routes
const mountRoutes = require("./routes/index");

// connect to the DB
dbConnection();

// Start the order availability check script (every 10 min)
startOrderAvailabilityCheck();

// Express App
const app = express();

// Enable other domains to access the application
app.use(cors());
app.options("*", cors());

// Compress all responses to make the app faster
app.use(compression());

// Middlewares
app.use(express.json()); // parsing to json
app.use(express.static(path.join(__dirname, "uploads")));

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  console.log(`mode: ${process.env.NODE_ENV}`);
}

// Mount Routes
mountRoutes(app);

app.all("*", (req, res, next) => {
  next(new ApiError(`Can't find this route: ${req.originalUrl}`, 400));
});

// Global Errors Handling middleware for express
app.use(globalError);

// server connect
const PORT = process.env.PORT || 1111;
const server = app.listen(PORT, () => {
  console.log(`App Running on PORT ${PORT}`);
});

// @desc    Handling rejection outside Express
process.on("unhandledRejection", (err) => {
  console.error(`Unhandled Rejection Errors: ${err.name} | ${err.message}`);
  server.close(() => {
    console.log("Shutting Down Server......");
    process.exit(1);
  });
});
