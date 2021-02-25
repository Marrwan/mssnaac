var express = require("express");
const { isLoggedIn } = require("../auth/auth");
const request = require('request');

var router = express.Router();

// LOAD MODELS
const MSSNNews = require('../models/MSSNNews');
const AcademicNews = require('../models/AcademicNews');
const ScholarshipNews = require('../models/ScholarshipNews');
const User = require("../models/User");
  

// GET-ROUTE : Get home page. 
router.get("/",  async(req, res,)=> {
  MSSNNews.find({}, (err, mssnnews)=>{
    AcademicNews.find({}, (err, academicnews)=>{
      ScholarshipNews.find({}, (err, scholarshipnews)=>{
         request('https://type.fit/api/quotes', function (error, response, body) {
            var data =  JSON.parse(body)
            res.render("index", {mssnnews, academicnews, scholarshipnews});
          });
        })
    })
  });
 
});
//  GET-ROUTE : Dashboard 
router.get("/dashboard", isLoggedIn, (req, res) => {
  User.find({}, (err, users) => {
    res.render("dashboard", { users });
  });
});

//  GET-ROUTE : Logout user. 
router.get("/logout", (req, res) => {
  req.logout();
  req.flash("success_msg", "You are logged out");
  res.redirect("back");
});

//  GET-ROUTE : Get about page. 
router.get('/about', (req,res)=>{
  res.render('about')
})

// GET-ROUTE : programmes page 
router.get('/programmes', (req,res)=>{
  res.render('programmes')
})
// GET-ROUTE : contact page 
router.get('/contact', (req,res)=>{
  res.render('contact')
})
// GET-ROUTE : executives page 
router.get('/executives', (req,res)=>{
  res.render('executives')
})
// GET-ROUTE : extramural page 
router.get('/extramural', (req,res)=>{
  res.render('extramural')
})
// facebook
router.get("/facebook",  (req, res) => {
  res.redirect("https://www.facebook.com/MSSNAAC/");
});
// Twitter
router.get("/twitter",  (req, res) => {
  res.redirect("https://twitter.com/mssnaac");
});
// Instagram
router.get("/instagram",  (req, res) => {
  res.redirect("https://www.instagram.com/aacmssn/");
});
// Whatsapp
router.get("/whatsapp",  (req, res) => {
  res.redirect("https://wa.me/+2348073302821");
});
module.exports = router;