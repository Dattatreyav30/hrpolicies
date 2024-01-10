const express = require("express");

const bodyParser = require("body-parser");

require("dotenv").config();

const cors = require("cors");

const app = express();

const mongoose = require("mongoose");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const chatRoute = require("./routes/chatRoute");
app.use(cors());

app.use(chatRoute);

app.get("/test", (req, res, next) => {
  res.status(200).json({ message: "succesfull" });
});

mongoose.connect(process.env.MONGODB_CONNECTION).then((res) => {
  console.log("connected");
  app.listen(5000);
});
   