const express = require('express');
const {Types: {ObjectId}} = require('mongoose');
const {model: QuizData, QuestionType} = require('../models/quizData');
const CourseData = require('../models/courseData');
const {UserType} = require('../models/user');
const checkAuth = require('../middleware/check-auth');

const {parseFilterFromRequest, executeHandler} = require("../utils");


const allUsersRouter = express.Router().use(checkAuth());
const adminLecturerRouter = express.Router().use('/', checkAuth(user => {
  return [UserType.admin, UserType.lecturer].includes(user.type);
}));
const studentRouter = express.Router().use('/', checkAuth(user => {
  return user.type === UserType.student;
}));


const router = express.Router();
router.use('/admin', adminLecturerRouter);
router.use('/student', studentRouter);
router.use(allUsersRouter);

// router
// -- allUsersRouter
// ----- get all
// ----- get by id
// -- adminLecturerRouter
// ---- post
// ---- delete
// ---- start, stop
// -- studentLecturer
// ---- postAnswer

//#region admin& lecturer routes
adminLecturerRouter.post('/', executeHandler(async ({request}) => {
  return await QuizData.create(request.body);
}));

adminLecturerRouter.put('/:id', executeHandler(async ({request}) => {
  const filter = await parseFilterFromRequest(request);
  const quiz = new QuizData(request.body);
  return QuizData.updateOne({_id: request.params.id}, quiz).limit(filter.limit).skip(filter.skip);
}));

adminLecturerRouter.delete("/:id", executeHandler(async ({request}) => {
  const filter = await parseFilterFromRequest(request);
  return QuizData.deleteOne({_id: request.params.id}).limit(filter.limit).skip(filter.skip);
}));

adminLecturerRouter.post('/:id/start', executeHandler(async ({request, loggedUser}) => {
  const startTime = new Date(request.body.startTime);
  const endTime = new Date(request.body.endTime);

  if (isNaN(startTime.getTime()) || isNaN(endTime.getTime())) {
    const err = new Error('Invalid start or end');
    err.statusCode = 400;
    throw err;
  }

  if(startTime.getTime() < new Date() || endTime.getTime() < new Date()) {
    const err = new Error('Cannot be in the past');
    err.statusCode = 400;
    throw err;
  }

  await QuizData.collection.updateOne({
    _id: new ObjectId(request.params.id),
  }, {
    $set: {startTime, endTime},
    $unset: {answers: ''}
  });
}));

adminLecturerRouter.post('/:id/stop', executeHandler(async ({request, loggedUser}) => {
  // TODO save startTime& endTime after closing?
  await QuizData.collection.updateOne({
    _id: new ObjectId(request.params.id),
  }, {
    $unset: {startTime: '', endTime: ''}
  });
}));

//#endregion

//#region student routes
studentRouter.get('/running-quizes', executeHandler(async ({loggedUser}) => {
  const courseIds = await CourseData.collection.distinct('_id', {
    usersId: loggedUser._id
  });

  return await QuizData.collection.find({
    courseId: {$in: courseIds},
    startTime: {$lte: new Date()},
    endTime: {$gte: new Date()},
  }).toArray();
}));

studentRouter.post('/:id/:questionId/open', executeHandler(async ({request, loggedUser}) => {
  await QuizData.collection.updateOne({
    _id: new ObjectId(request.params.id),
  }, {
    $set: {
      [`answers.${loggedUser._id.toString()}.${request.params.questionId}`]: request.body.answer
    }
  });
}));

studentRouter.post('/:id/:questionId/answer', executeHandler(async ({request, loggedUser}) => {
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
//#endregion

allUsersRouter.get("/", executeHandler(async ({request, loggedUser}) => {
  // const isStudent = loggedUser.type === UserType.student;
  // if (isStudent) {
  //   // TODO
  //   // active courses in which is participating, today courses
  // } else {
  const filter = parseFilterFromRequest(request);
  return QuizData.find(filter.where).limit(filter.limit).skip(filter.skip);
  // }
}));

allUsersRouter.get('/:id', executeHandler(async ({request}) => {
  const filter = await parseFilterFromRequest(request);
  return QuizData.findById(request.params.id).limit(filter.limit).skip(filter.skip);
}));

module.exports = router;

