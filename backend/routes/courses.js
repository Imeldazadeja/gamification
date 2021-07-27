const express = require("express");
const CoursesData = require("../models/courseData");
const {parseFilterFromRequest} = require('../utils');

const router = express.Router();

router.post('/', (req, res, next) => {
  // const courseData = new CoursesData({
  //   title: req.body.title,
  //   courseStudyCycle: req.body.courseStudyCycle,
  //   student: req.body.student,
  //   lecturer: req.body.lecturer
  // });
  // courseData.save().then(result => {
  //   const obj = {...result._doc};
  //   res.status(200).json(obj);
  // }).catch(error => {
  //   res.status(500).json({error});
  // });
  CoursesData.create(req.body, (error, data) => {
    if (error) {
      return next(error);
    } else {
      res.json(data);
    }
  })
});

router.get("/", (req, res, next) => {
  const filter = parseFilterFromRequest(req);
  CoursesData.find(filter.where).limit(filter.limit).skip(filter.skip).then(data => {
    res.status(200).json(data);
  });
});

// router.get('/', )
// GET /courses?filter={"studentId": {"oid": "543534256362363463"}}

module.exports = router;
