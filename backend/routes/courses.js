const express = require("express");
const CoursesData = require("../models/courseData");
const {parseFilterFromRequest, executeHandler} = require('../utils');

const router = express.Router();

router.post('/', executeHandler(async ({request}) => {
  return await CoursesData.create(request.body);
}));

router.get("/", executeHandler(async ({request}) => {
  const filter = parseFilterFromRequest(request);
  return CoursesData.find(filter.where).limit(filter.limit).skip(filter.skip);
}));

// router.get('/', )
// GET /courses?filter={"studentId": {"oid": "543534256362363463"}}

module.exports = router;
