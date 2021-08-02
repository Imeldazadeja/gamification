const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const {executeHandler} = require('../utils');
const {model: UserModel, UserType} = require('../models/user');
const AdminData = require("../models/adminData");
const StudentData = require("../models/studentData");
const LecturerData = require("../models/lecturerData");

const checkAuth = require("../middleware/check-auth");
const router = express.Router();
const routerUnauthenticated = express.Router();

router.use('/', checkAuth);

/***** Signup admin  ***/

/***** Signup students  ***/

router.post("/signup-student", checkAuth, async (req, res) => {
  const hash = await bcrypt.hash(req.body.password, 10);
  const studentUser = new StudentData({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: hash,
    faculty: req.body.faculty,
    studyProgramme: req.body.studyProgramme,
    studyCycle: req.body.studyCycle,
    registrationDate: req.body.registrationDate
  });

  studentUser.save().then(result => {
    const obj = {...result._doc};
    delete obj.password;
    res.status(200).json(obj);
  }).catch(error => {
    res.status(500).json({error});
  });
});

/***** Get students  ***/

router.get("/signup-student", (req, res, next) => {
  StudentData.find().then(data => {
    res.status(200).json(data);
  });
});

/***** Delete students  ***/


/***** Signup lecturer  ***/

router.post('/signup-lecturer', checkAuth, (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then(hash => {
      const lecturerUser = new LecturerData({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: hash,
        faculty: req.body.faculty
      });
      lecturerUser.save().then(result => {
        const obj = {...result._doc};
        delete obj.password;
        res.status(200).json({obj});
      }).catch(err => {
        res.status(500)
          .json({
            error: err
          });
      });
    });
});

/***** Get Lecturer ****/
router.get("/signup-lecturer", (req, res, next) => {
  LecturerData.find().then(data => {
    res.status(200).json(data);
  });
});

router.post("/signup", executeHandler(async ({request, loggedUser}) => {
  if (loggedUser.type !== UserType.admin) {
    throw new Error('TODO');
  }

  const hash = await bcrypt.hash(request.body.password, 10);
  const adminData = new AdminData({
    firstName: request.body.firstName,
    lastName: request.body.lastName,
    email: request.body.email,
    password: hash
  });
  const user = await adminData.save();

  const obj = {...user._doc};
  delete obj.password;
  return obj;
}));

router.delete("/", executeHandler(({request, loggedUser}) => {
  return StudentData.deleteOne({_id: request.params.id}).then(() => null);
}));

routerUnauthenticated.post('/login', executeHandler(async ({request}) => {
  const user = await UserModel.findOne({email: request.body.email});
  if (!user) {
    const err = new Error('Unauthorized');
    err.statusCode = 401;
    throw err;
  }
  if (!await bcrypt.compare(request.body.password, user.password)) {
    const err = new Error('Unauthorized');
    err.statusCode = 401;
    throw err;
  }

  const token = jwt.sign(
    {email: user.email, userId: user._id},
    'secret_this_should_be_longer',
    {expiresIn: "1h"}
  );

  delete user.password;
  return {token, expiresIn: 3600, user};
}));

module.exports = router;
