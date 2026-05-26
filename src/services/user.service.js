import crypto from "crypto";
import User from "../models/user.model.js";

export const getUsers = async ({ page = 1, limit = 10 } = {}) => {
  const filter = { isDeleted: false };
  const skip = (page - 1) * limit;

  const [total, user] = await Promise.all([
    User.countDocuments(filter),
    User.find(filter).skip(skip).limit(limit).lean(),
  ]);

  const data = user.map((item) => ({
    id: item._id.toString(),
    name: item.name,
    email: item.email,
    phoneNumber: item.phoneNumber,
    address: item.address,
    identity: item.identity,
    dob: item.dob,
    isDeleted: item.isDeleted,
    role: item.role,
  }));

  return {
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 0,
    },
  };
};

export const registerUser = async (userData) => {
  const { email, password, name, phoneNumber, address, identity, dob, role } = userData;

  if (!email || !password) {
    throw Object.assign(new Error("Email và mật khẩu không được để trống"), {
      statusCode: 400,
    });
  }

  const existingUser = await User.findOne({ email, isDeleted: false });
  if (existingUser) {
    throw Object.assign(new Error("Email đã tồn tại"), {
      statusCode: 409,
    });
  }

  const hashedPassword = crypto.createHash("sha256").update(password).digest("hex");

  const newUser = await User.create({
    name,
    email,
    phoneNumber,
    address,
    identity,
    dob,
    role: role || "STUDENT",
    password: hashedPassword,
  });

  return {
    id: newUser._id.toString(),
    name: newUser.name,
    email: newUser.email,
    role: newUser.role,
  };
};

export const loginUser = async ({ email, password }) => {
  if (!email || !password) {
    throw Object.assign(new Error("Email và mật khẩu không được để trống"), {
      statusCode: 400,
    });
  }

  const user = await User.findOne({ email, isDeleted: false });
  if (!user) {
    throw Object.assign(new Error("Email hoặc mật khẩu không chính xác"), {
      statusCode: 401,
    });
  }

  const hashedPassword = crypto.createHash("sha256").update(password).digest("hex");
  if (user.password !== hashedPassword && user.password !== password) {
    throw Object.assign(new Error("Email hoặc mật khẩu không chính xác"), {
      statusCode: 401,
    });
  }

  const apiKey = user.apiKey || crypto.randomBytes(16).toString("hex");
  if (!user.apiKey) {
    user.apiKey = apiKey;
    await user.save();
  }

  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
    apiKey,
  };
};
