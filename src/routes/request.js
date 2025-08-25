const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../middlewares/auth");

requestRouter.post("/sendConnectionRequest", userAuth, async (req, res) => {
  // Read the user from the request object because the userAuth middleware is injecting the user in the request object
  const user = req.user;

  // Sending a Connect requets
  res.send("Connection request Send by " + user.firstName);
});

module.exports = requestRouter;
