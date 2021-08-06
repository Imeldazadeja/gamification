const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const courseDataSchema = new mongoose.Schema({
  title: {type: String, required: true},
  courseCycle: {type: String, required: true,},
  usersId: [{type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true}],
  lecturerId: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
}, {
  collection: 'Course', toJSON: {virtuals: true}, toObject: {virtuals: true}
});

courseDataSchema.virtual('lecturer', {
  ref: 'User',
  localField: 'lecturerId',
  foreignField: '_id',
  justOne: true,
});
courseDataSchema.virtual('user', {
  ref: 'User',
  localField: 'usersId',
  foreignField: '_id',
});

// Course {lecturer, students, }

// Student {}
// Course {studentIds: ObjectId[]}
// CourseStudent {courseId, studentId}

courseDataSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Course', courseDataSchema);
