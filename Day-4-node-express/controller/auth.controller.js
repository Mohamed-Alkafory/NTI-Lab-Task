const { registerUser, loginUser } = require("../services/auth.service.js");

const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const user = await registerUser({ name, email, password, role });
    return res
      .status(201)
      .json({ message: "User registered successfully", user });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { user, token } = await loginUser(email, password);
    return res
      .status(200)
      .json({ message: "User login successful", user, token });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

module.exports = { register, login };


