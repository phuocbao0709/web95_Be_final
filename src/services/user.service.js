import User from "../models/user.model.js";

export const getUsers = async ({ page = 1, limit = 10 } = {}) => {
  const filter = { isDeleted: false };
  const skip = (page - 1) * limit;

  const [total, user] = await Promise.all([
    User.countDocuments(filter),
    User.find(filter).skip(skip).limit(limit).lean(),
  ]);

  const data = user.map((item) => ({
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
