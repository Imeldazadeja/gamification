const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require('cors');

// const postsRoutes = require("./routes/posts");
const userRoutes = require("./routes/user");
const coursesRoutes = require("./routes/courses");
const quizRoutes = require("./routes/quiz");

const UserModel = require('./models/user').model;
const QuizModel = require('./models/quizData');

const app = express();
app.use(cors());


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use("/api/user", userRoutes);
app.use("/api/courses", coursesRoutes); // POST /courses
app.use("/api/quiz", quizRoutes);

async function initDb() {
  const mongooseConnector = await mongoose.connect(
    'mongodb+srv://m001-student:imelda19@sandbox.doso9.mongodb.net/gamificationDatabase',
    {useNewUrlParser: true});
  const db = mongooseConnector.connection.db;

  const models = [UserModel, QuizModel];
  for (const model of models) {
    const schemaValidator = model.schema.options && model.schema.options.schemaValidator;
    if (!schemaValidator) continue;

    await db.createCollection(model.modelName).catch(() => {});
    await db.command({
      collMod: model.modelName,
      validator: schemaValidator,
    });
  }

  return mongooseConnector;
}

module.exports = {app, initDb};

