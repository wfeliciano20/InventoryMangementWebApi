const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const Users = require("../models/user");
const User = mongoose.model("users");

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
    },
    async (username, password, done) => {
      const query = await User.findOne({ email: username }).exec();
      if (!query) {
        return done(null, false, {
          message: "Incorrect username.",
        });
      }
      if (!query.validPassword(password)) {
        return done(null, false, {
          message: "Incorrect password",
        });
      }
      return done(null, query);
    }
  )
);
