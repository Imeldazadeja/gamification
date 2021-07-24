const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const courseDataSchema = mongoose.Schema({
  title: { type: String, required: true},
  courseStudyCycle: { type: String, required: true},
  student: [{type: mongoose.Schema.Types.ObjectId, ref: 'StudentData', required: true}],
  lecturer: [{type: mongoose.Schema.Types.ObjectId, ref: 'LecturerData', required: true}],
});

// Course {studentIds: ObjectId[]}
// CourseStudent {courseId, studentId}

courseDataSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Course', courseDataSchema);
