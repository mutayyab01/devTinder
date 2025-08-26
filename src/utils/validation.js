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

const validateEditProfileData = (request) => {
  const allowedEditField = [
    "firstName",
    "lastName",
    "age",
    "gender",
    "about",
    "photoURL",
    "skills",
    "location",
    "occupation",
    "company",
    "education",
    "interests",
    "githubURL",
    "linkedinURL",
    "portfolioURL"
  ];
  const isEditAllowed = Object.keys(request.body).every((field) =>
    allowedEditField.includes(field)
  );

  return isEditAllowed;
};
module.exports = {
  validateSignupData,
  validateLoginData,
  validateEditProfileData,
};
