const express = require("express");
const {parseFilterFromRequest, executeHandler} = require('../utils');
const checkAuth = require("../middleware/check-auth");
const CoursesData = require("../models/courseData");
const {UserType} = require('../models/user');

const router = express.Router().use(checkAuth);

router.post('/', executeHandler(async ({request}) => {
  return await CoursesData.create(request.body);
}));

router.get("/", executeHandler(async ({request, loggedUser}) => {
  const filter = parseFilterFromRequest(request);
  if (loggedUser.type === UserType.lecturer) {
    const conditions = Object.entries(filter.where || {}).map(([propertyName, value]) => ({[propertyName]: value}));
    conditions.push({
      lecturerId: loggedUser._id,
    });
    filter.where = {$and: conditions};
  } else if (loggedUser.type === UserType.student) {
    //
  }

  return CoursesData.find(filter.where).limit(filter.limit).skip(filter.skip).populate(filter.populate);
}));

// router.get('/', )
// GET /courses?filter={"studentId": {"oid": "543534256362363463"}}

module.exports = router;
