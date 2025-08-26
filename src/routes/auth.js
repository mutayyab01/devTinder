const express = require("express");
const authRouter = express.Router();
const {  validateSignupData,  validateLoginData } = require("../utils/validation");
const User = require("../models/user");
const bcrypt = require("bcrypt");

authRouter.post("/signup", async (req, res) => {
  try {
    // Validate the Body
    validateSignupData(req);

    // Encrypt the Password
    const { firstName, lastName, email, password } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);

    // Create a new instannce of the User model
    const user = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
    });

    await user.save();
    res.send("User Added Successfully");
  } catch (error) {
    res.status(400).send("An Unexpected Error Occured " + error.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate Login Data
    validateLoginData(email, password);

    // Check the user if it Exist in the Database or not
    const user = await User.findOne({ email: email });
    if (!user) {
      throw new Error("Invalid Crendential! PLease Signup First!");
    }

    // Checking the passowrd It is Valid or Not
    const ispasswordValid = await user.validatePassword(password);

    if (ispasswordValid) {
      // Create a JWT Token
      const token = await user.getJWT();

      // Add the token to  cookie and send the response back to the user
      res.cookie("token", token, {
        httpOnly: true,
        expires: new Date(Date.now() + 24 * 3600000), // cookie will be removed after 24 hours
      });

      res.send(user);
    } else {
      throw new Error("Please Check your Email or Password!");
    }
  } catch (error) {
    res.status(400).send("An Unexpected Error Occured " + error.message);
  }
});

authRouter.post("/logout", async (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
  })
  .send("User Logout Successfully")
  
});

module.exports = authRouter;
