const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const courseDataSchema = mongoose.Schema({
  title: {type: String, required: true},
  courseCycle: {type: String, required: true},
  studentIds: [{type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true}],
  lecturerId: {type: mongoose.Schema.Types.ObjectId, ref: 'Lecturer', required: true},
}, {
  collection: 'Course'
});

// Student {}
// Course {studentIds: ObjectId[]}
// CourseStudent {courseId, studentId}

courseDataSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Course', courseDataSchema);
