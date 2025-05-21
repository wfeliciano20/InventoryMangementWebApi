//Some of the code in this file was reused from CS465 Full Stack Guide Module 7
const express = require("express");
const jwt = require("jsonwebtoken"); // Enable JSON Web Tokens
const router = express.Router();

// Method to authenticate our JWT
function authenticateJWT(req, res, next) {
  // console.log('In Middleware');
  const authHeader = req.headers["authorization"];
  // console.log('Auth Header: ' + authHeader);
  if (authHeader == null) {
    console.log("Auth Header Required but NOT PRESENT!");
    return res.sendStatus(401).json({ error: "Authorization header required" });
  }
  let headers = authHeader.split(" ");
  if (headers.length < 1) {
    console.log("Not enough tokens in Auth Header: " + headers.length);
    return res.sendStatus(501);
  }
  const token = authHeader.split(" ")[1];
  // console.log('Token: ' + token);
  if (token == null) {
    //console.log("Null Bearer Token");
    return res.sendStatus(401);
  }

  const verified = jwt.verify(
    token,
    process.env.JWT_SECRET,
    (err, verified) => {
      if (err) {
        return res.sendStatus(401).json("Token Validation Error!");
      }
      req.auth = verified; // Set the auth param to the decoded object
    }
  );
  next(); // We need to continue or this will hang forever
}

// the next function is not from CS465 FullStack Guide
// refresh token middleware
function validateRefreshToken(req, res, next) {
  // get the token from body
  const refreshToken = req.body.refreshToken;

  // bad request if token is not present
  if (!refreshToken) {
    return res.status(400).json({ error: "Refresh token required" });
  }

  //decode the token and add userId to request object
  jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, decoded) => {
    if (err) {
      console.error("Refresh token verification failed:", err.message);
      return res.status(403).json({
        error: "Invalid refresh token",
        details: err.message,
      });
    }

    if (!decoded.userId) {
      return res.status(403).json({ error: "Token missing required user ID" });
    }

    req.userId = decoded.userId;
    next();
  });
}

const authController = require("../controllers/authentication");

router.route("/register").post(authController.register);
router.route("/login").post(authController.login);
// the next line is not from CS465 FullStack Guide
router
  .route("/refresh-token")
  .post(validateRefreshToken, authController.refreshToken);

// Code not from CS465
const inventoryController = require("../controllers/inventory");
router
  .route("/inventory-items")
  .get(authenticateJWT, inventoryController.inventoryItems)
  .post(authenticateJWT, inventoryController.itemsAddItem);

router
  .route("/inventory-items/:id")
  .get(authenticateJWT, inventoryController.itemsFindById)
  .put(authenticateJWT, inventoryController.itemsUpdateItem)
  .delete(authenticateJWT, inventoryController.itemsDeleteItem);

module.exports = router;
