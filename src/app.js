require("dotenv").config();
const express = require("express");
const { connectDB } = require("./config/database");
const app = express();
const User = require("./models/user");
const { validateSignupData, validateLoginData } = require("./utils/validation");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const JWT = require("jsonwebtoken");
const { userAuth } = require("./middlewares/auth");

app.use(express.json());
app.use(cookieParser());

app.post("/signup", async (req, res) => {
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

app.post("/login", async (req, res) => {
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


      res.send("User Successfully Login");
    } else {
      throw new Error("Please Check your Email or Password!");
    }
  } catch (error) {
    res.status(400).send("An Unexpected Error Occured " + error.message);
  }
});

app.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;

    res.send(user);
  } catch (error) {
    throw new Error("Something Went Wrong");
  }
});

app.post("/sendConnectionRequest", userAuth, async (req, res) => {
  // Read the user from the request object because the userAuth middleware is injecting the user in the request object
  const user = req.user;

  // Sending a Connect requets
  res.send("Connection request Send by " + user.firstName);
});

connectDB()
  .then(() => {
    console.log("Database Connection Established");
    app.listen(3000, () => {
      console.log("Server is running on port 3000");
    });
  })
  .catch(() => {
    console.error("Database Connot be Connected");
  });
