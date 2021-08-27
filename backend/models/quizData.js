const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const answerQuestions = new mongoose.Schema({
  answer: {type: String, required: true}
});

// type Answer = {[studentId: string]: {[questionId: string]: string}};

const questionDataSchema = new mongoose.Schema({
  questionTopic: {type: String, required: true},
  question: {type: String, required: true},
  answerQuestion: [answerQuestions],
});

// const StudentAnswerSchema = new mongoose.Schema({
//
// })

const quizDataSchema = new mongoose.Schema({
  title: {type: String, required: true},
  child: [questionDataSchema],
  courseId: {type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true},
}, {
  collection: 'Quiz',
  schemaValidator: {
    $jsonSchema: {
      required: ['title', 'courseId'],
      properties: {
        title: {bsonType: 'string'},
        courseId: {bsonType: 'objectId'},
        child: {bsonType: 'array'},
        answers: {
          bsonType: 'object',
          patternProperties: {
            "\\w+": {
              bsonType: 'object',
              patternProperties: {
                "\\w+": {
                  bsonType: ['null', 'string']
                }
              }
            }
          },
        },
      },
    }
  },
});

quizDataSchema.virtual('course', {
  ref: 'Course',
  localField: 'courseId',
  foreignField: '_id',
  justOne: true,
});

quizDataSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Quiz', quizDataSchema);


