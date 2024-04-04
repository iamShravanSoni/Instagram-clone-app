const mongoose = require("mongoose");
const passport = require("passport");
const plm = require("passport-local-mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/instagramcloneappdatas");

// Define the User schema
const userSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: [true, "First Name is required"],
    trim: true, //Remove unncessary space
  },
  lastname: {
    type: String,
    required: [true, "Last Name is required"],
    trim: true, //Remove unncessary space
  },
  username: {
    type: String,
    minlength: [5, "Name must be at least 5 characters"],
    trim: true, //Remove unncessary space
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    minlength: [5, "Email must be at least 5 characters"],
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Please fill in a valid email address",
    ], // Matches email against regex
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [5, "Password must be at least 5 characters"],
    select: false,
  },
  bio: {
    type: String,
  },
  like: [
    {
      type: String,
      default: "",
    },
  ],
  profileimage: {
    type: String,
  },
  posts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "post",
    },
  ],
},
{
  timestamp : true
}
);

userSchema.plugin(plm);

// Create the User model
const user = mongoose.model("user", userSchema);

module.exports = user;
