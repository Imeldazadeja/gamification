const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator")

const lecturerDataSchema = mongoose.Schema({
  firstName: { type: String, required: true},
  lastName: { type: String, required: true},
  email: { type: String, required: true, unique: true},
  password: { type: String, required: true},
  faculty: { type: String, required: true},
  course: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true}]
})


lecturerDataSchema.plugin(uniqueValidator);

module.exports = mongoose.model("LecturerData", lecturerDataSchema);
