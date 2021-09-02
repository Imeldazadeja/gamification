const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const QuestionType = {selectOption: 'S', text: 'T'};


// type Answer = {[studentId: string]: {[questionId: string]: string}};

const questionDataSchema = new mongoose.Schema({
  type: {type: String, required: true},
  questionTopic: {type: String, required: true},
  question: {type: String, required: true},
  options: {type: [String], required: true},
  correctOptionIndex: {type: Number},
}, {
  collection: 'Question',
  schemaValidator: {
    $jsonSchema: {
      required: ['type', 'questionTopic', 'question'],
      properties: {
        type: {bsonType: 'string', enum: Object.values(QuestionType)},
        questionTopic: {bsonType: String},
        question: {bsonType: 'string'},
        options: {
          bsonType: ['null', 'array'],
          items: {bsonType: 'string'},
          minItems: 1,
          maxItems: 10,
        },
      },
    },
    $or: [
      {type: QuestionType.text},
      {
        type: QuestionType.selectOption,
        $and: [
          {options: {$type: 'array'}},
          {correctOptionIndex: {$type: 'int'}},
        ]
      },
    ]
  }
});

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
        // { [StudentId]: { [QuestionId]: answer} }
        answers: {
          bsonType: 'object',
          patternProperties: {
            "\\w+": {
              bsonType: 'object',
              patternProperties: {
                "\\w+": {
                  bsonType: ['null', 'string', 'number']
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

module.exports = {
  model: mongoose.model('Quiz', quizDataSchema),
  QuestionType,
};


