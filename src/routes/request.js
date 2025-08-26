const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      // Read the user from the request object because the userAuth middleware is injecting the user in the request object
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status.toLowerCase();

      const allowedStatus = ["ignored", "interested"];
      if (!allowedStatus.includes(status)) {
        return res
          .status(400)
          .json({ error: `Status ${status} is not supported` });
      }

      const toUser = await User.findById(toUserId);
      if (!toUser) {
        return res.status(404).json({ message: "User Not Found!" });
      }

      // If there is an existing Connection Request in the the DB or not
      const existingConnectionRequest = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });

      if (existingConnectionRequest) {
        return res
          .status(400)
          .json({ message: "Connection Request Already Exists!" });
      }

      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });

      const data = await connectionRequest.save();

      // Sending a Connect requets
      res.json({
        message: `Connection request Send by : ${req.user.firstName}`,
        data,
      });
    } catch (error) {
      res.status(400).send("Error: " + error.message);
    }
  }
);

requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const logginUser = req.user;
      const requestId = req.params.requestId;
      const status = req.params.status.toLowerCase();

      // Validate the Status
      const allowedStatus = ["accepted", "rejected"];
      if (!allowedStatus.includes(status)) {
        return res
          .status(400)
          .json({ message: `Status ${status} is not supported` });
      }

      const connectionRequest = await ConnectionRequest.findOne({
        _id: requestId,
        toUserId: logginUser._id,
        status: "interested",
      });

      if (!connectionRequest) {
        return res
          .status(404)
          .json({ message: "No Pending Connection Request Found!" });
      }

      connectionRequest.status = status;
      const data = await connectionRequest.save();
      res.json({ message: `Connection Request ${status} Successfully!`, data });
    } catch (error) {
      res.status(400).send("Error: " + error.message);
    }
  }
);

module.exports = requestRouter;
