const express = require("express");
const cors = require("cors");
const app = express();
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const { MONGO_CLIENT_EVENTS } = require("mongodb");
const PORT = process.env.PORT || 3000;

//middlewares acting like bouncers for any incoming request
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(cookieParser());

//connect mongodb

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("data base connected");
  })
  .catch((err) => {
    console.log(err);
  });

app.get("/", (req, res) => {
  res.json({ message: "hello developer" });
});

app.listen(PORT, () => {
  console.log(`listening on PORT : ${PORT}`);
});
