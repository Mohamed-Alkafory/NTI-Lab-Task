// services/auth.service.js
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../models/user.model.js");
const { JWT_SECRET, JWT_EXPIRES_IN } = require("../config/env.config.js");

const registerUser = async (userData) => {
  const { name, email, password, role } = userData;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error("Email already exists");
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = await User.create({
    name,
    email,
    password: hashedPassword,
    ...(role && { role }),
  });

  const userObj = newUser.toObject();
  delete userObj.password;
  return userObj;
};

const loginUser = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("Invalid credentials");
  }

  const isPasswordMatch = await bcrypt.compare(password, user.password);
  if (!isPasswordMatch) {
    throw new Error("Invalid credentials");
  }

  const token = generateToken(user);
  const userObj = user.toObject();
  delete userObj.password;

  return { user: userObj, token };
};

const generateToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN || "1d",
  });
};

module.exports = { registerUser, loginUser, generateToken };

