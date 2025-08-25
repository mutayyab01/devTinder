const mongoose = require("mongoose");
const JWT = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const validate = require("validator");
const userScheme = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 50,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 50,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate(value) {
        if (!validate.isEmail(value)) {
          throw new Error("Invalid Email Address! " + value);
        }
      },
    },
    password: {
      type: String,
      required: true,
    },
    age: {
      type: String,
      trim: true,
    },
    gender: {
      type: String,
      trim: true,
      validate(value) {
        if (!["Male", "Female", "Other"].includes(value)) {
          throw new Error("Please Choose the Correct Option Form the List!");
        }
      },
    },
    about: {
      type: String,
      trim: true,
    },
    photoURL: {
      type: String,
      trim: true,
      validate(value) {
        if (!validate.isURL(value)) {
          throw new Error("Invalid Photo URL! " + value);
        }
      },
    },
    skills: {
      type: [String],
    },
  },
  { timestamps: true }
);

// if you write arrow function then that doesn't work
userScheme.methods.getJWT = async function () {
  // Referencing to this User Object
  const user = this;

  // Create a JWT Token
  const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: "1d",
  });
  return token;
};

userScheme.methods.validatePassword = async function (passwordInputByUser) {
  // Referencing to this User Object
  const user = this;

  const passwordHash = user.password;

  const ispasswordValid = bcrypt.compare(passwordInputByUser, passwordHash);
  return ispasswordValid;
};

module.exports = mongoose.model("User", userScheme);
