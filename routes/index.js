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
    console.log("Null Bearer Token");
    return res.sendStatus(401);
  }

  // console.log(process.env.JWT_SECRET);
  // console.log(jwt.decode(token));
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
const authController = require("../controllers/authentication");

router.route("/register").post(authController.register);
router.route("/login").post(authController.login);

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
