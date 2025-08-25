const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const { validateEditProfileData } = require("../utils/validation");

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (error) {
    throw new Error("Something Went Wrong");
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateEditProfileData(req)) {
      throw new Error("Invalid Edit Request! ");
    }
    const user = req.user;
    Object.keys(req.body).forEach((keys) => (user[keys] = req.body[keys]));

    await user.save();

    res.json({
      message: `${user.firstName},Your Profile Updated Successfully`,
      data: user,
    });
  } catch (error) {
    throw new Error(error);
  }
});
module.exports = profileRouter;
