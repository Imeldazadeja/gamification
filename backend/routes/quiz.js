const express = require('express');
const QuizData = require("../models/quizData");

const {parseFilterFromRequest, executeHandler} = require("../utils");

const router = express.Router();

router.post('/', executeHandler(async ({request}) => {
  return await QuizData.create(request.body);
}));

router.get("/", executeHandler(async ({request}) => {
  const filter = parseFilterFromRequest(request);
  return QuizData.find(filter.where).limit(filter.limit).skip(filter.skip);
}));


// router.get('/:id', (req, res, next)=> {
//   QuizData.findById(req.params.id).then(quiz => {
//     if(quiz) {
//       res.status(200).json(quiz);
//     } else {
//       res.status(404).json({ message: "Quiz not found!" })
//     }
//   });
// });

router.get('/:id', executeHandler( async ({request}) => {
  const filter = await parseFilterFromRequest(request);
  return QuizData.findById(request.params.id).limit(filter.limit).skip(filter.skip);
}));

router.delete("/:id", executeHandler(async ({request})=> {
  const filter = await parseFilterFromRequest(request);
  return QuizData.deleteOne({_id: request.params.id}).limit(filter.limit).skip(filter.skip);
}));

router.put('/:id', executeHandler(async ({request}) => {
  const filter = await parseFilterFromRequest(request);
  const quiz = new QuizData(request.body);
  return QuizData.updateOne({_id: request.params.id}, quiz).limit(filter.limit).skip(filter.skip);
}));

module.exports = router;

