const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const questionDataSchema = new mongoose.Schema({
  questionTopic: {type: String, required: true},
  question: {type: String, required: true}
})
const quizDataSchema = new mongoose.Schema({
  title: {type: String, required: true},
  child: [questionDataSchema],
  courseId: {type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true}
}, {
  collection: 'Quiz',
  schemaValidator: {
    $jsonSchema: {
      required: ['title', 'courseId'],
      properties: {
        title: {bsonType: 'string'},
        courseId: {bsonType: 'objectId'},
        child: {bsonType: 'array'}
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


