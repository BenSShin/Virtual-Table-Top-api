const express = require("express");
const router = express.Router();
const handleError = require("../../../utils/handleError");
const User = require("../../../models/user");
const jwt = require("jsonwebtoken");

router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already registered" });
    }

    const newUser = new User({ email, password });
    await newUser.save();

    res.status(201).json({ message: "User registered scucessfully" });
  } catch (error) {
    console.log(error);
    handleError(error, res);
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid email or passowrd" });
    }

    const token = jwt.sign({ userId: user._id }, "secretKey");
    res.status(200).json({ token });
  } catch (error) {
    console.log("Error logging in:", error);
    handleError(erros, res);
  }
});
