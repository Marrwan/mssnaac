var express = require("express");
var bcrypt = require("bcryptjs");
var passport = require("passport");

var router = express.Router();

// LOAD MODELS
var User = require("../models/User");

// SIGUP ROUTE
router
.route("/signup")
//  GET-ROUTE : Get form to sigup . 
  .get((req, res) => {
    res.render("signup");
  })
  // CREAT-ROUTE:  signup handle
  .post((req, res,next) => {
    const {
      name,
      username,
      email,
      password,
      confirm,
      gender,
      userType,
    } = req.body;

    let errors = [];

    if (
      !name ||
      !username ||
      !email ||
      !password ||
      !confirm ||
      !userType ||
      !gender
    ) {
      errors.push({ msg: "Please fill in all fields" });
    }

    if (password.length <= 5) {
      errors.push({ msg: "Password must be greater than five characters" });
    }

    if (password != confirm) {
      errors.push({ msg: "Passwords do not match" });
    }

    if (errors.length > 0) {
      res.render("signup", {
        errors,
        email,
        name,
        username,
        password,
        confirm,
        userType,
        gender,
      });
    } else {
      User.findOne({ email: email }).then((founduser) => {
        errors.push({ msg: "A user with that email already exist" });
        if (founduser) {
          res.render("signup", {
            errors,
            email,
            name,
            username,
            password,
            confirm,
            userType,
            gender,
          });
        } else {
          const newUser = new User({
            email,
            name,
            password,
            username,
            userType,
            gender,
          });
          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hashed) => {
              newUser.password = hashed;
              newUser
                .save()
                .then((user) => {
                  req.flash(
                    "success_msg",
                    "Congrats! You are now a registered member"
                  );
                  passport.authenticate("local", {
                    successRedirect: "/dashboard",
                    failureRedirect: "/login",
                    failureFlash: true,
                  })(req, res, next);
                })
                .catch((err) => {
                  throw err;
                });
            });
          });
        }
      });
    }
  });

// LOGIN ROUTE
router
  .route("/login")
  // GET-ROUTE : show login form
  // .get((req, res) => {
  //   res.render("login");
  // })
  // CREATE-ROUTE handle login
  .post((req, res, next) => {
    passport.authenticate("local", {
      successRedirect: "back",
      failureRedirect: "back",
      failureFlash: true,
    })(req, res, next);
  });
module.exports = router;
