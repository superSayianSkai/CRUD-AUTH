const { required } = require("joi");
const mongoose = require("mongoose");
const { title } = require("process");

const postSchema = mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      required: [true, ["Title is required"]],
      minLength: 20,
    },
    description: {
      type: String,
      trim: true,
      required: [true, ["description is required"]],
      minLength: 20,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timeStamp: true,
  }
);

module.exports = mongoose.model("post", postSchema);
