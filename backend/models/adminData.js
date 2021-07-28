const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator")

const adminDataSchema = mongoose.Schema({
  firstName: { type: String, required: true},
  lastName: { type: String, required: true},
  email: { type: String, required: true, unique: true},
  password: { type: String, required: true}
}, {
  collection: 'Admin'
});

adminDataSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Admin", adminDataSchema);
