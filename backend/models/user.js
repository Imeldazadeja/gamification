'use strict';
const mongoose = require("mongoose");

const UserType = {admin: 'A', lecturer: 'L', student: 'S'};

const userSchema = mongoose.Schema({
  email: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  firstName: {type: String, required: true},
  lastName: {type: String, required: true},
  type: {type: String, required: true},
  // lecturer & student
  faculty: {type: String},
  // student
  studyProgramme: {type: String},
  studyCycle: {type: String},
  registrationDate: {type: Date},
}, {
  collection: 'User',
  schemaValidator: {
    $jsonSchema: {
      required: ['email', 'password', 'type'],
      properties: {
        email: {bsonType: 'string'},
        password: {bsonType: 'string'},
        type: {bsonType: 'string', enum: Object.values(UserType)}
      },
    },
    $or: [
      {type: UserType.admin},
      {
        type: UserType.lecturer,
        $and: [
          {faculty: {$type: 'string'}},
        ]
      },
      {
        type: UserType.student,
        $and: [
          {faculty: {$type: 'string'}},
          {studyProgramme: {$type: 'string'}},
          {studyCycle: {$type: 'string'}}
        ]
        // studyProgramme: {$type: 'string'}
      }
    ],
  },
});

userSchema.pre('remove', async function(next) {
  await this.model('Course').remove({usersId: this._id}, next);
});

module.exports = {
  model: mongoose.model("User", userSchema), UserType
};
