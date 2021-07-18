const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")

const AdminData = require("../models/adminData");
const StudentData = require("../models/studentData");
const LecturerData = require("../models/lecturerData");
const router = express.Router();
const checkAuth = require("../middleware/check-auth");

router.post("/signup", (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then(hash => {
      const adminData = new AdminData({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: hash
      });
      adminData.save()
        .then(result => {
          res.status(201).json({
            message: 'User created!',
            result: result
          });
        })
        .catch(err => {
          res.status(500).json({
            error: err
          });
        });
    });
});

router.post("/signup-student", checkAuth, (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then(hash => {
      const studentUser = new StudentData({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: hash,
        faculty: req.body.faculty,
        studyProgramme: req.body.studyProgramme,
        studyCycle: req.body.studyCycle,
        registrationDate: req.body.registrationDate
      });
      studentUser.save().then(result => {
        res.status(200)
          .json({
            message: 'User Created!',
            result: result
          });
      }).catch(err => {
        res.status(500)
          .json({
            error: err
          });
      });
    });
});

router.post('/signup-lecturer', checkAuth, (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then(hash => {
      const lecturerUser = new LecturerData({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: hash,
        faculty: req.body.faculty
      });
      lecturerUser.save().then(result => {
        res.status(200)
          .json({
            message: 'User added!',
            result: result
          });
      }).catch(err => {
        res.status(500)
          .json({
            error: err
          });
      });
    });
});

router.post("/login", (req, res, next) => {
  let fetchedUser;
  AdminData.findOne({email: req.body.email})
    .then( user => {
    if(!user) {
      return res.status(401).json({
        message: "Auth failed"
      });
    }
    fetchedUser = user;
    return bcrypt.compare(req.body.password, user.password);
  })
    .then(result => {
      if (!result) {
        return res.status(401).json({
          message: "Auth failed"
        });
      }

      const token = jwt.sign(
        {email: fetchedUser.email, userId: fetchedUser._id},
        'secret_this_should_be_longer',
        {expiresIn: "1h"}
      );
      res.status(200).json({
        token: token,
        expiresIn: 3600
      });

    })
    .catch(err => {
      return res.status(401).json({
        message: "Auth failed"
      });
    });
});

module.exports = router;
