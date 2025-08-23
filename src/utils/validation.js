const validator = require("validator");
const validateSignupData = (request) => {
  const { firstName, lastName, email, password } = request.body;
  if (!firstName || !lastName) {
    throw new Error("Name is not Valid!");
  } else if (!validator.isEmail(email)) {
    throw new Error("Email is not Valid!");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Please Enter Strong Password!");
  }
};

const validateLoginData = (email, password) => {
  if (!validator.isEmail(email)) {
    throw new Error("Email is not Valid!");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Please Enter Strong Password!");
  }
};

module.exports = {
  validateSignupData,
  validateLoginData
};
