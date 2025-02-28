const express = require("express");
const cors = require("cors");
const app = express();
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const PORT = process.env.PORT || 3000;

//middlewares acting like bouncers for any incoming request
const authRouter = require("./src/routers/authRouter");
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(cookieParser());

//connect mongodb

const database = async () => {
  console.log("trying to connect..");

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("connected to database");
  } catch (error) {
    console.log(error);
  }
};

app.use("/api", authRouter);

app.get("/", (req, res) => {
  res.json({ message: "hello developer" });
});

app.listen(PORT, () => {
  console.log(`listening on PORT : ${PORT}`);
  database();
});
