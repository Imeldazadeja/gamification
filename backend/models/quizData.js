const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const questionDataSchema = new mongoose.Schema({
  questionTopic: {type: String, required: true},
  question: {type: String, required: true}
})
const quizDataSchema = new mongoose.Schema({
  title: {type: String, required: true},
  child: [{type: questionDataSchema}]
}, {
  collection: 'Quiz'
});

quizDataSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Quiz', questionDataSchema);


