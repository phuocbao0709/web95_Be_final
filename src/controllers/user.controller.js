<<<<<<< HEAD
import { getUsers } from "../services/user.service.js";

export const getAllUsers = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.max(1, parseInt(req.query.limit, 10) || 10);

    const { data, pagination } = await getUsers({ page, limit });
    res.status(200).json({
      message: "Lấy danh sách giáo viên thành công",
      data,
      pagination,
    });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi lấy danh sách giáo viên",
=======
import crypto from "crypto";
import User from "../models/user.model.js";

export const registerUser = async (req, res) => {
  try {
    const { userName, email, password } = req.body;

    if (!userName || !email || !password) {
      return res.status(400).json({
        message: "userName, email, and password are required",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }

    const newUser = new User({
      userName,
      email,
      password,
    });

    await newUser.save();

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser._id,
        userName: newUser.userName,
        email: newUser.email,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (user.password !== password) {
      return res.status(401).json({
        message: "Invalid password",
      });
    }

    // Generate apiKey: mern-$userId$-$email$-$randomstring$
    const randomString = crypto.randomUUID();
    const apiKey = `mern-${user._id}-${user.email}-${randomString}`;

    // Store the apiKey in the database
    user.apiKey = apiKey;
    await user.save();

    res.status(200).json({
      message: "Login successful",
      apiKey,
      user: {
        id: user._id,
        userName: user.userName,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
>>>>>>> d34965cb5d130c9c19f4bff0ae28a688f501f659
      error: error.message,
    });
  }
};
