const express = require("express");
const router = express.Router();
const handleError = require("../../../utils/handleError");
const User = require("../../../models/user");

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
