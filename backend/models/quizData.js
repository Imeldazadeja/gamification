const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const QuestionType = {selectOption: 'S', text: 'T'};


// type Answer = {[studentId: string]: {[questionId: string]: string}};

const questionDataSchema = new mongoose.Schema({
  type: {type: String, required: true},
  questionTopic: {type: String, required: true},
  points: {type: Number, required: true},
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
  numQuestions: {type: Number, required: true},
  startTime: {type: Date},
  endTime: {type: Date},
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
        numQuestions: {bsonType: 'int'},
        child: {bsonType: 'array'},
        startTime: {bsonType: 'date'},
        endTime: {bsonType: 'date'},
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
        points: {
          bsonType: 'object',
          patternProperties: {
            "\\w+": {
              bsonType: 'object',
              patternProperties: {
                "\\w+": {
                  bsonType: 'number'
                }
              }
            }
          },
        }
      },
    },
    $and: [
      {
        $or: [
          {startTime: {$exists: false}, endTime: {$exists: false}},
          {
            startTime: {$exists: true}, endTime: {$exists: true},
            $expr: {$gt: ['$endTime', '$startTime']}
          }
        ],
      },
      // TODO child.length >= numQuestions && numQuestions >= 1
    ],
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


