const express = require("express");
const { isLoggedIn, isAdmin, isStudent } = require("../auth/auth");

// Load Models
const MSSNNews = require("../models/MSSNNews");
const AcademicNews = require("../models/AcademicNews");
const ScholarshipNews = require("../models/ScholarshipNews");
const User = require("../models/User");

var router = express.Router();

// MSSN NEWS ROUTE

router
  .route("/mssn")
  //  GET-ROUTE : Get mssn news page.
  .get((req, res) => {
    MSSNNews.find({}, (err, mssnnews) => {
      if (err) throw err;
      res.render("news/mssn/mssn", { mssnnews });
    });
  });
router
  .route("/mssn/new")
  //  GET-ROUTE : Get form to add new mssn news.
  .get(isLoggedIn, isAdmin,(req, res) => {
    MSSNNews.find({}, (err, mssnnews) => {
      if (err) throw err;
      res.render("news/mssn/new", { mssnnews });
    });
  })
  // CREATE-ROUTE : adds new mssnnews.
  .post(isLoggedIn, isAdmin,(req, res) => {
    MSSNNews.find({}, (err, mssnnews) => {
      if (err) throw err;
      const { title, post, excerpt } = req.body;
      let errors = [];
      if (!title || !post || !excerpt) {
        errors.push({ msg: "Please fill in all fields" });
      }
      if (title.lenght < 5) {
        errors.push({ msg: "Title must be at least 5 characters" });
      }
      if (errors.length > 0) {
        res.render("news/mssn/new", { title, post, excerpt, errors, mssnnews });
      } else {
        MSSNNews.findOne({ title }, (err, foundMSSNnews) => {
          if (err) throw err;
          if (foundMSSNnews) {
            errors.push({ msg: "A post with this title already exist" });
            res.render("news/mssn/new", { title, post, excerpt, errors, mssnnews });
          } else {
            let author = req.user.username;
            let newMSSNnews = new MSSNNews({
              post,
              title,
              author,
              excerpt,
            });
            newMSSNnews.save((err, savedNews) => {
              if (err) throw err;
              req.flash("success_msg", `Post has been successfully added`);
              res.redirect("/news/mssn");
            });
          }
        });
      }
    });
  });
router
  .route("/mssn/:title")
  // SHOW-ROUTE : show specific mssn news
  .get(async (req, res) => {
    const title = req.params.title;
    await MSSNNews.findOne({ title }, (err, mssnnews) => {
      if (err) throw err;
      res.render("news/mssn/show", { mssnnews });
    });
  });
router
  .route("/mssn/:title/edit")
  // EDIT-ROUTE : shows form to edit specific mssn news
  .get(isLoggedIn,isAdmin,(req, res) => {
    const title = req.params.title;
    MSSNNews.findOne({ title }, (err, mssnnews) => {
      if (err) throw err;
      res.render("news/mssn/edit", { mssnnews });
    });
  })
  //  EDIT-ROUTE : edit a specific mssn news.
  .put(isLoggedIn,isAdmin,(req, res) => {
    // ========================================
    MSSNNews.findOne({ title: req.params.title }, (err, mssnnews) => {
      const { title, post, excerpt } = req.body;
      let errors = [];
      if (!title || !post || !excerpt )  {
        errors.push({ msg: "Please fill in all fields" });
      }
      if (title.lenght < 5) {
        errors.push({ msg: "Title must be at least 5 characters" });
      }
      if (errors.length > 0) {
        res.render("news/mssn/edit", { title, post, excerpt, errors, mssnnews });
      } else {
        MSSNNews.findOneAndUpdate(
          { title: req.params.title },
          req.body,
          (err, updatedMSSNnews) => {
            if (err) throw err;
            req.flash("success_msg", `Update Successfull`);
            res.redirect(`/news/mssn`);
          }
        );
      }
    });
  });
//  DELETE-ROUTE : deletes a specific mssn news
router.delete("/mssn/:title/delete", isLoggedIn,isAdmin, (req, res) => {
  MSSNNews.findOneAndRemove({ title: req.params.title }, (err, deleted) => {
    if (err) {
      res.redirect(`/news/mssn/${req.params.title}`);
      req.flash("error_msg", err);
      console.log(err);
    } else {
      req.flash("success_msg", `successfully deleted`);
      res.redirect("/news/mssn");
    }
  });
});
// =============================================================

// ACADEMICS NEWS ROUTE

router
  .route("/academics")
  //  GET-ROUTE : Get academics news page.
  .get(isLoggedIn,isAdmin,(req, res) => {
    AcademicNews.find({}, (err, academicnews) => {
      if (err) throw err;
      res.render("news/academics/academics", { academicnews });
    });
  });
router
  .route("/academics/new")
  //  GET-ROUTE : Get form to add new mss ews.
  .get(isLoggedIn,isAdmin,(req, res) => {
    AcademicNews.find({}, (err, academicnews) => {
      if (err) throw err;
      res.render("news/academics/new", { academicnews });
    });
  })
  // CREATE-ROUTE : adds ew academicnews.
  .post(isLoggedIn,isAdmin,(req, res) => {
    AcademicNews.find({}, (err, academicnews) => {
      if (err) throw err;
      const { title, post, excerpt } = req.body;
      let errors = [];
      if (!title || !post || !excerpt) {
        errors.push({ msg: "Please fill in all fields" });
      }
      if (title.lenght < 5) {
        errors.push({ msg: "Title must be at least 5 characters" });
      }
      if (errors.length > 0) {
        res.render("news/academics/new", { title, post, excerpt, errors, academicnews });
      } else {
        AcademicNews.findOne({ title }, (err, foundAcademicNews) => {
          if (err) throw err;
          if (foundAcademicNews) {
            errors.push({ msg: "A post with this title already exist" });
            res.render("news/academics/new", { title, post,excerpt, errors, academicnews });
          } else {
            let author = req.user.username;
            let newacademicnews = new AcademicNews({
              post,excerpt,
              title,
              author,
            });
            newacademicnews.save((err, savedNews) => {
              if (err) throw err;
              req.flash("success_msg", `Post has been successfully added`);
              res.redirect("/news/academics");
            });
          }
        });
      }
    });
  });
router
  .route("/academics/:title")
  // SHOW-ROUTE : show specific academic news
  .get((req, res) => {
    const title = req.params.title;
    AcademicNews.findOne({ title }, (err, academicnews) => {
      if (err) throw err;
      res.render("news/academics/show", { academicnews });
    });
  });
router
  .route("/academics/:title/edit")
  // EDIT-ROUTE : shows form to edit specific academic news
  .get(isLoggedIn,isAdmin,(req, res) => {
    const title = req.params.title;
    AcademicNews.findOne({ title }, (err, academicnews) => {
      if (err) throw err;
      res.render("news/academics/edit", { academicnews });
    });
  })
  //  EDIT-ROUTE : edit a specific academic news.
  .put(isLoggedIn,isAdmin,(req, res) => {
    AcademicNews.findOne({ title: req.params.title }, (err, academicnews) => {
      const { title, post, excerpt } = req.body;
      let errors = [];
    if (!title || !post || !excerpt) {
        errors.push({ msg: "Please fill in all fields" });
      }
      if (title.lenght < 5) {
        errors.push({ msg: "Title must be at least 5 characters" });
      }
      if (errors.length > 0) {
        res.render("news/academics/edit", { title, post, excerpt, errors, academicnews });
      } else {
    AcademicNews.findOneAndUpdate(
          { title: req.params.title },
          req.body,
          (err, updatedAcademic) => {
            if (err) throw err;
            req.flash("success_msg", `Update Successfull`);
            res.redirect(`/news/academics`);
          }
        );
      }
    });
  });
//  DELETE-ROUTE : deletes a specific mssn news
router.delete("/mssn/:title/delete", isLoggedIn,isAdmin,(req, res) => {
  AcademicNews.findOneAndRemove({ title: req.params.title }, (err, deleted) => {
    if (err) {
      res.redirect(`/news/academics/${req.params.title}`);
      req.flash("error_msg", err);
      console.log(err);
    } else {
      req.flash("success_msg", `successfully deleted`);
      res.redirect("/news/academics");
    }
  });
});

// SCHOLARSHIP NEWS ROUTE

router.route("/scholarship")
  //  GET-ROUTE : Get scholarship news page.
  .get((req, res) => {
    ScholarshipNews.find({}, (err, scholarshipnews) => {
      if (err) throw err;
      res.render("news/scholarship/scholarship", { scholarshipnews });
    });
  });
router
  .route("/scholarship/new")
  //  GET-ROUTE : Get form to add new mss ews.
  .get(isLoggedIn,isAdmin,(req, res) => {
    ScholarshipNews.find({}, (err, scholarshipnews) => {
      if (err) throw err;
      res.render("news/scholarship/new", { scholarshipnews });
    });
  })
  // CREATE-ROUTE : adds ew scholarshipnews.
  .post(isLoggedIn,isAdmin,(req, res) => {
    ScholarshipNews.find({}, (err, scholarshipnews) => {
      if (err) throw err;
      const { title, post, excerpt } = req.body;
      let errors = [];
      if (!title || !post || !excerpt) {
        errors.push({ msg: "Please fill in all fields" });
      }
      if (title.lenght < 5) {
        errors.push({ msg: "Title must be at least 5 characters" });
      }
      if (errors.length > 0) {
        res.render("news/scholarship/new", { title, post, excerpt, errors, scholarshipnews });
      } else {
        ScholarshipNews.findOne({ title }, (err, foundScholarshipNews) => {
          if (err) throw err;
          if (foundScholarshipNews) {
            errors.push({ msg: "A post with this title already exist" });
            res.render("news/scholarship/new", { title, post, excerpt, errors, scholarshipnews });
          } else {
            let author = req.user.username;
            let newScholarshipNews = new ScholarshipNews({
              post, excerpt,
              title,
              author,
            });
            newScholarshipNews.save((err, savedNews) => {
              if (err) throw err;
              req.flash("success_msg", `Post has been successfully added`);
              res.redirect("/news/scholarship");
            });
          }
        });
      }
    });
  });
router
  .route("/scholarship/:title")
  // SHOW-ROUTE : show specific scholarship news
  .get((req, res) => {
    const title = req.params.title;
    ScholarshipNews.findOne({ title }, (err, scholarshipnews) => {
      if (err) throw err;
      res.render("news/scholarship/show", { scholarshipnews });
    });
  });
router
  .route("/scholarship/:title/edit")
  // EDIT-ROUTE : shows form to edit specific scholarship news
  .get(isLoggedIn,isAdmin,(req, res) => {
    const title = req.params.title;
    ScholarshipNews.findOne({ title }, (err, scholarshipnews) => {
      if (err) throw err;
      res.render("news/scholarship/edit", { scholarshipnews });
    });
  })
  //  EDIT-ROUTE : edit a specific scholarship news.
  .put(isLoggedIn,isAdmin,(req, res) => {
    ScholarshipNews.findOne({ title: req.params.title }, (err, scholarshipnews) => {
      const { title, post, excerpt } = req.body;
      let errors = [];
      if (!title || !post || !excerpt) {
        errors.push({ msg: "Please fill in all fields" });
      }
      if (title.lenght < 5) {
        errors.push({ msg: "Title must be at least 5 characters" });
      }
      if (errors.length > 0) {
        res.render("news/scholarship/edit", { title, post, excerpt, errors, scholarshipnews });
      } else {
        ScholarshipNews.findOneAndUpdate(
          { title: req.params.title },
          req.body,
          (err, updatedScholarshipNews) => {
            if (err) throw err;
            req.flash("success_msg", `Update Successfull`);
            res.redirect(`/news/scholarship/${req.params.title}`);
          }
        );
      }
    });
  });
//  DELETE-ROUTE : deletes a specific scholarship news
router.delete("/scholarship/:title/delete", isLoggedIn,isAdmin, (req, res) => {
  ScholarshipNews.findOneAndRemove({ title: req.params.title }, (err, deleted) => {
    if (err) {
      res.redirect(`/news/scholarship/${req.params.title}`);
      req.flash("error_msg", err);
      console.log(err);
    } else {
      req.flash("success_msg", `successfully deleted`);
      res.redirect("/news/scholarship");
    }
  });
});

module.exports = router;
