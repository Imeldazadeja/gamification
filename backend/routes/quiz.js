const express = require('express');
const QuizData = require("../models/quizData");

const {parseFilterFromRequest, executeHandler} = require("../utils");

const router = express.Router();

router.post('/', executeHandler(async ({request}) => {
  console.log('here');
  return await QuizData.create(request.body);
}));

router.get("/", executeHandler(async ({request}) => {
  const filter = parseFilterFromRequest(request);
  return QuizData.find(filter.where).limit(filter.limit).skip(filter.skip);
}));

module.exports = router;

