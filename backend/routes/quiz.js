const express = require('express');
const {Types: {ObjectId}} = require('mongoose');
const {model: QuizData, QuestionType} = require('../models/quizData');
const checkAuth = require('../middleware/check-auth');

const {parseFilterFromRequest, executeHandler} = require("../utils");

const router = express.Router().use(checkAuth);

router.post('/', executeHandler(async ({request}) => {
  return await QuizData.create(request.body);
}));

router.get("/", executeHandler(async ({request}) => {
  const filter = parseFilterFromRequest(request);
  return QuizData.find(filter.where).limit(filter.limit).skip(filter.skip);
}));

router.get('/:id', executeHandler(async ({request}) => {
  const filter = await parseFilterFromRequest(request);
  return QuizData.findById(request.params.id).limit(filter.limit).skip(filter.skip);
}));

router.delete("/:id", executeHandler(async ({request}) => {
  const filter = await parseFilterFromRequest(request);
  return QuizData.deleteOne({_id: request.params.id}).limit(filter.limit).skip(filter.skip);
}));

router.put('/:id', executeHandler(async ({request}) => {
  const filter = await parseFilterFromRequest(request);
  const quiz = new QuizData(request.body);
  return QuizData.updateOne({_id: request.params.id}, quiz).limit(filter.limit).skip(filter.skip);
}));

router.post('/:id/:questionId/open', executeHandler(async ({request, loggedUser}) => {
  await QuizData.collection.updateOne({
    _id: new ObjectId(request.params.id),
    [`answers.${loggedUser._id.toString()}.${request.params.questionId}`]: {$not: {$type: 'string'}}
  }, {
    $set: {
      [`answers.${loggedUser._id.toString()}.${request.params.questionId}`]: request.body.answer
    }
  });
}));

router.post('/:id/:questionId/answer', executeHandler(async ({request, loggedUser}) => {
  const quizId = new ObjectId(request.params.id);
  const quiz = await QuizData.collection.findOne({_id: quizId});
  const questionId = new ObjectId(request.params.questionId);
  const question = quiz.child.find(e => e._id.equals(questionId));
  if (!question) {
    throw new Error('Question not found');
  }

  if (question.type === QuestionType.text) {
    if (!request.body || typeof request.body.answer !== 'string' || !request.body.answer.trim()) {
      throw new Error('Invalid answer');
    }
  } else {
    if (!request.body || !Number.isInteger(request.body.answer) || request.body.answer < 0 || request.body.answer > question.options.length) {
      throw new Error('Invalid answer');
    }
  }

  await QuizData.collection.updateOne({
    _id: quizId,
    [`answers.${loggedUser._id.toString()}.${request.params.questionId}`]: null,
  }, {
    $set: {
      [`answers.${loggedUser._id.toString()}.${request.params.questionId}`]: request.body.answer
    }
  });
}));

module.exports = router;

