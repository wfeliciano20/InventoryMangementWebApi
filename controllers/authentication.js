// Some of the code in this file was reused from CS465 Full Stack Guide Module5
const User = require("../models/user");
const passport = require("passport");
const jwt = require("jsonwebtoken"); // Enable JSON Web Tokens

const register = async (req, res) => {
  // Validate message to insure that all parameters are present
  if (!req.body.name || !req.body.email || !req.body.password) {
    return res.status(400).json({
      error: "All fields required",
    });
  }

  const user = new User({
    name: req.body.name, // Set User name
    email: req.body.email, // Set e-mail address
    password: "", // Start with empty password
  });

  user.setPassword(req.body.password); // Set user password
  // the next line is not from CS465 FullStack Guide
  const refreshToken = user.generateRefreshToken(); // generate refresh token
  const q = await user.save(); //save user data and refresh token

  if (!q) {
    // Database returned no data
    return res.status(400).json("Error Creating User");
  } else {
    // Return new user token
    const token = user.generateJWT();
    // the next line is not from CS465 FullStack Guide
    return res.status(200).json({ token, refreshToken, userName: user.name });
  }
};

const login = async (req, res) => {
  // Validate message to ensure that email and password are present.
  if (!req.body.email || !req.body.password) {
    return res.status(400).json({ message: "All fields required" });
  }
  // Delegate authentication to passport module
  passport.authenticate("local", async (err, user, info) => {
    if (err) {
      // Error in Authentication Process
      return res.status(404).json(err);
    }
    if (user) {
      // Auth succeeded - generate JWT and return to caller
      const token = user.generateJWT();
      // the following three lines are not from CS465 FullStack Guide
      const refreshToken = user.generateRefreshToken();
      await user.save(); // Save the refresh token to the user document
      res.status(200).json({ token, refreshToken, userName: user.name });
    } else {
      // Auth failed return error
      res.status(401).json(info);
    }
  })(req, res);
};

// This code is not from CS465 FullStack Guide
const refreshToken = async (req, res) => {
  // Get the user id that the middleware for refresh token attached to the req obj
  const { userId } = req;

  //if the userId is not present then there is a Refresh Token error
  if (!userId) {
    return res.status(400).json({ error: "Refresh token required" });
  }

  try {
    // Find the user
    const user = await User.findById(userId);

    // if there is no user, the refresh token is invalid send error
    if (!user) {
      return res.status(403).json({ error: "Invalid refresh token" });
    }

    // Generate new access token
    const newToken = user.generateJWT();
    const newRefreshToken = user.generateRefreshToken();
    await user.save();
    return res
      .status(200)
      .json({ token: newToken, refreshToken: newRefreshToken });
  } catch (err) {
    //console.log("error", err.message);
    return res.status(500).json({ error: "Invalid or expired refresh token" });
  }
};

module.exports = {
  register,
  login,
  refreshToken,
};
