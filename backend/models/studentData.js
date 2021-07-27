const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator")

const studentDataSchema = mongoose.Schema({
  firstName: { type: String, required: true},
  lastName: { type: String, required: true},
  email: { type: String, required: true, unique: true},
  password: { type: String, required: true},
  faculty: { type: String, required: true},
  studyProgramme: { type: String, required: true},
  studyCycle: { type: String, required: true},
  registrationDate: {type: Date, required: true},
  // course: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true}]
}, {
  collection: 'Student'
});


studentDataSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Student", studentDataSchema);
