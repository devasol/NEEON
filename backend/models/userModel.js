const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validator = require("validator");

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, "User Name Required!"],
  },
  email: {
    type: String,
    required: [true, "Email is Required"],
    unique: true,

    lowercase: true,
    validate: [validator.isEmail, "Please provide email!"],
  },
  username: {
    type: String,
    required: [true, "username is Required!"],
    unique: true,
    tolower: true,
  },
  password: {
    type: String,
    required: [true, "Please provide password!"],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, "Please confirm password!"],
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: "Password is not the same!",
    },
  },
  role: {
    type: String,
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
  googleId: {
    type: String,
    unique: true, // Each Google account should map to one user
    sparse: true, // Allow null values for non-Google users
  },
});

userSchema.pre("save", async function (next) {
  // Only run this function if password was actually modified
  if (!this.isModified("password")) return next();

  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);
  
  // Delete passwordConfirm field as it's only used for validation
  this.passwordConfirm = undefined;
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

const UserModel = mongoose.model("User", userSchema);

module.exports = UserModel;
