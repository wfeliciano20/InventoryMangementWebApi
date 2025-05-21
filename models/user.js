// The code in this file was reused from CS465 Full Stack Guide Module7
const mongoose = require("mongoose");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  hash: String,
  salt: String,
});

// Method to set the password on this record.
userSchema.methods.setPassword = function (password) {
  // Add validation
  if (!password || typeof password !== "string") {
    throw new Error("Password is required and must be a string");
  }
  // generate the unique salt to hash password
  this.salt = crypto.randomBytes(16).toString("hex");
  // Generate hash the password
  this.hash = crypto
    .pbkdf2Sync(password, this.salt, 1000, 64, "sha512")
    .toString("hex");
};

// Method to compare entered password against stored hash
userSchema.methods.validPassword = function (password) {
  var hash = crypto
    .pbkdf2Sync(password, this.salt, 1000, 64, "sha512")
    .toString("hex");
  return this.hash === hash;
};

// Method to generate a JSON Web Token for the current record
userSchema.methods.generateJWT = function () {
  return jwt.sign(
    {
      // Payload for our JSON Web Token
      userId: this._id,
      email: this.email,
      name: this.name,
    },
    process.env.JWT_SECRET, //SECRET stored in .env file
    { expiresIn: "1h" }
  ); //Token expires an hour from creation
};

// the next method is not from CS465 FullStack Guide
// Method to generate refresh token
userSchema.methods.generateRefreshToken = function () {
  const refreshToken = jwt.sign(
    {
      userId: this._id,
    },
    process.env.JWT_REFRESH_SECRET, // Use a jwt refresh secret for refresh tokens
    { expiresIn: "7d" } // Longer expiration time (7 days)
  );

  this.refreshToken = refreshToken;
  this.refreshTokenExpires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days from now

  return refreshToken;
};

const User = mongoose.model("users", userSchema);
module.exports = User;
