const mongoose = require("mongoose");

// Define the Post schema
const postSchema = new mongoose.Schema({
  caption: {
    type: String,
    default: "",
  },
  picture: {
    type: String,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
  ],
  comments: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
      },
      text: String,
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create the Post model
const post = mongoose.model("post", postSchema);

module.exports = post;
