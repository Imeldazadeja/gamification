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
    const conditions = Object.entries(filter.where || {}).map(([propertyName, value]) => ({[propertyName] : value}));
    conditions.push({
      usersId: loggedUser._id
    });
    filter.where = {$and: conditions};
  }

  return CoursesData.find(filter.where).limit(filter.limit).skip(filter.skip).populate(filter.populate);
}));

router.get('/:id', executeHandler(async ({request}) => {
  const filter = await parseFilterFromRequest(request);
  return CoursesData.findById(request.params.id).limit(filter.limit).skip(filter.skip);
}));

router.put('/:id', executeHandler(async ({request}) => {
  const filter = await parseFilterFromRequest(request);
  const course = new CoursesData(request.body);
  return CoursesData.updateOne({_id: request.params.id}, course).limit(filter.limit).skip(filter.skip);
}));

router.delete("/:id", executeHandler(async ({request})=> {
  const filter = await parseFilterFromRequest(request);
  return CoursesData.deleteOne({_id: request.params.id}).limit(filter.limit).skip(filter.skip);
}));

// router.get('/', )
// GET /courses?filter={"studentId": {"oid": "543534256362363463"}}

module.exports = router;
