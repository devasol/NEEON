const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, "User Name Required!"],
  },
  email: {
    type: String,
    required: [true, "Email is Required"],
  },
  username: {
    type: String,
    required: [true, "username is Required!"],
  },
  role: {
    type: String,
    required: [true, "Role is Required!"],
  },
  status: {
    type: String,
  },
  image: {
    type: {
      data: Buffer,
      contentType: String,
    },
    select: false,
  },
});

const UserModel = mongoose.model("User", userSchema);

module.exports = UserModel;
