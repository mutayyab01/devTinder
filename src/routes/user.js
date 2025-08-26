const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
const userRouter = express.Router();

const USER_SAVE_DATA = "firstName lastName age about gender skills photoURL";
// Get all the Pending Connction Request for the Loggedin User
userRouter.get("/user/requests/recieved", userAuth, async (req, res) => {
  try {
    const logginUser = req.user;

    // Get all the Connection Request for the Loggin User
    const connectionRequest = await ConnectionRequest.find({
      toUserId: logginUser._id,
      status: "interested",
    }).populate("fromUserId", USER_SAVE_DATA);
    // }).populate("fromUserId", ["firstName", "lastName"]);

    if (!connectionRequest) {
      return res.status(404).send("No pending connection requests found.");
    }

    res.json({
      message: "Pending connection requests found.",
      data: connectionRequest,
    });
  } catch (error) {
    res.status(400).send("Error: " + error.message);
  }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const logginUser = req.user;

    const connectionRequest = await ConnectionRequest.find({
      $or: [
        { toUserId: logginUser._id, status: "accepted" },
        { fromUserId: logginUser._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", USER_SAVE_DATA)
      .populate("toUserId", USER_SAVE_DATA);

    const data = connectionRequest.map((row) => {
      if (row.fromUserId._id.toString() === logginUser._id.toString()) {
        return row.toUserId;
      }
      return row.fromUserId;
    });

    if (!connectionRequest) {
      return res.status(404).send("No connections found.");
    }

    res.json({
      message: "Connections  found.",
      data,
    });
  } catch (error) {
    res.status(400).send("Error: " + error.message);
  }
});

userRouter.get("/user/feed", userAuth, async (req, res) => {
  try {
    const loggInUser = req.user;
    const pageNumber = parseInt(req.query.page) || 1;
    let pageLimit = parseInt(req.query.limit) || 10;
    pageLimit = pageLimit > 50 ? 50 : pageLimit;

    const skip = (pageNumber - 1) * pageLimit;

    // Find all the Connection Request either I send Or Not.
    const connectionRequest = await ConnectionRequest.find({
      $or: [{ fromUserId: loggInUser._id }, { toUserId: loggInUser._id }],
    }).select("fromUserId toUserId");

    if (!connectionRequest) {
      return res.status(404).send("No connection requests found.");
    }

    const hideUserFromFeed = new Set();
    connectionRequest.forEach((req) => {
      hideUserFromFeed.add(req.fromUserId.toString());
      hideUserFromFeed.add(req.toUserId.toString());
    });

    const users = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUserFromFeed) } },
        { _id: { $ne: loggInUser._id } },
      ],
    })
      .select(USER_SAVE_DATA)
      .skip(skip)
      .limit(pageLimit);

    res.json({
      message: "User feed data",
      data: users,
    });
  } catch (error) {
    res.status(400).send("Error: " + error.message);
  }
});

module.exports = userRouter;
