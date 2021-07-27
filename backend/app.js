const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require('cors');

const postsRoutes = require("./routes/posts");
const userRoutes = require("./routes/user");
const coursesRoutes = require("./routes/courses");

const app = express();
app.use(cors());

mongoose.connect(
  'mongodb+srv://m001-student:imelda19@sandbox.doso9.mongodb.net/gamificationDatabase',
  {useNewUrlParser: true})
  .then(()=> {
    console.log('Connected to database!');
  })
  .catch(() => {
    console.log('Connection failed!');
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/images", express.static(path.join("backend/images")));

// app.use((req, res, next) => {
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   res.setHeader(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept, Authorization"
//   );
//   res.setHeader(
//     "Access-Control-Allow-Methods",
//     "GET, POST, PATCH, PUT, DELETE, OPTIONS"
//   );
//   next();
// });

app.use("/api/posts", postsRoutes);
app.use("/api/user", userRoutes);
app.use("/api/courses", coursesRoutes); // POST /courses
module.exports = app;

