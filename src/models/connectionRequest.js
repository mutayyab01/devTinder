const mongoose = require("mongoose");
const ConnectionRequestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ["ignored", "interested", "accepted", "rejected"],
        message: `{VALUE} is not supported`,
      },
      lowercase: true,
    },
  },
  {
    timestamps: true,
  }
);

ConnectionRequestSchema.index({ fromUserId: 1, toUserId: 1 });

ConnectionRequestSchema.pre("save", function (next) {
  const connectionRequest = this;

  // Check if FromUserID is same as toUserId
  if (connectionRequest.fromUserId.equals(this.toUserId)) {
    throw new Error("You Cann't Send Connection Request to Yourself!");
  }
  next();
});

const ConnectionRequest = new mongoose.model(
  "ConnectionRequest",
  ConnectionRequestSchema
);
module.exports = ConnectionRequest;
