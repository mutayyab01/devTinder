const JWT = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  try {
    // Read the token from the request cookie
    const { token } = req.cookies;
    if (!token) {
      throw new Error("Token is Not Valid! Please Login Again!");
    }

    //validate the User
    const decodedObject = await JWT.verify(token, process.env.JWT_SECRET_KEY);
    const { _id } = decodedObject;

    // Find the user
    const user = await User.findById(_id);
    if (!user) {
      throw new Error("User Not Found");
    }
    req.user = user;
    next();
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = {
  userAuth,
};
