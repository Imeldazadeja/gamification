const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const courseDataSchema = new mongoose.Schema({
  title: {type: String, required: true},
  courseCycle: {type: String, required: true,},
  studentsId: [{type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true}],
  lecturerId: {type: mongoose.Schema.Types.ObjectId, ref: 'Lecturer', required: true},
}, {
  collection: 'Course', toJSON: {virtuals: true}, toObject: {virtuals: true}
});

courseDataSchema.virtual('lecturer', {
  ref: 'Lecturer',
  localField: 'lecturerId',
  foreignField: '_id',
  justOne: true,
});
courseDataSchema.virtual('students', {
  ref: 'Student',
  localField: 'studentsId',
  foreignField: '_id',
});

// Course {lecturer, students, }

// Student {}
// Course {studentIds: ObjectId[]}
// CourseStudent {courseId, studentId}

courseDataSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Course', courseDataSchema);
