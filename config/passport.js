// The code from this file was taken from CS465 Full Stack Guide Module 7
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const Users = require("../models/user");
const User = mongoose.model("users");

// Configure passport to use local strategy (username/password)
passport.use(
  // Specify that we're using 'email' as the username field
  new LocalStrategy(
    {
      usernameField: "email",
    },
    async (username, password, done) => {
      // Find user by email in MongoDB
      const query = await User.findOne({ email: username }).exec();
      // If user not found
      if (!query) {
        return done(null, false, {
          message: "Incorrect username.",
        });
      }
      // If password doesn't match
      if (!query.validPassword(password)) {
        return done(null, false, {
          message: "Incorrect password",
        });
      }
      // return user if Auth was successful
      return done(null, query);
    }
  )
);
