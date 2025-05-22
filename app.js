// Some of the code in this file was reused from CS465 Full Stack Guide Module7
require("dotenv").config();
var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var swaggerUi = require("swagger-ui-express");
var fs = require("fs");
// Wire in our authentication module
var passport = require("passport");
require("./config/passport");

var apiRouter = require("./routes/index");

var app = express();

// Bring in the database
require("./models/db");

// Enable Cors for Web Portal
app.use("/api", (req, res, next) => {
  res.header(
    "Access-Control-Allow-Origin",
    "http://localhost:5173",
    "https://inventorymanagementappwebclient-e0bqhmh8dmejfne3.canadacentral-01.azurewebsites.net"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-Width, Content-Type, Accept, Authorization"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  next();
});

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(passport.initialize());
//  Code not from CS465
app.use("/api", apiRouter);

//  Code not from CS465
// Swagger Documentation
const swaggerDocumentationContent = JSON.parse(
  fs.readFileSync("./openApi.json", "utf-8")
);
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocumentationContent)
);

// Catch unauthorized error and create 401
app.use((err, req, res, next) => {
  if (err.name === "UnauthorizedError") {
    res.status(401).json({ message: err.name + ": " + err.message });
  }
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  next(createError(err.status == 500 ? 500 : err.status));
});

module.exports = app;
