import crypto from "crypto";
import Teacher from "../models/teacher.model.js";
import User from "../models/user.model.js";
import TeacherPosition from "../models/teacherPosition.model.js";

const educationLevelRank = {
  "Tien si": 4,
  "Thac si": 3,
  "Cu nhan": 2,
  "Cao dang": 1,
  "Trung cap": 0,
};

const getHighestEducation = (degrees = []) => {
  if (!degrees.length) {
    return null;
  }

  const sortedDegrees = [...degrees].sort((left, right) => {
    const leftRank = educationLevelRank[left.type] ?? -1;
    const rightRank = educationLevelRank[right.type] ?? -1;

    if (leftRank !== rightRank) {
      return rightRank - leftRank;
    }

    return Number(right.year || 0) - Number(left.year || 0);
  });

  return sortedDegrees[0];
};

const mapTeacher = (teacher) => {
  const positions = (teacher.teacherPositionsId ?? []).map((position) => ({
    id: position._id?.toString?.() ?? "",
    name: position.name,
    code: position.code,
  }));
  const education = (teacher.degrees ?? []).map((degree) => ({
    level: degree.type ?? "",
    school: degree.school ?? "",
    major: degree.major ?? "",
    year: degree.year ?? "",
    isGraduated: degree.isGraduated ?? false,
  }));
  const highestEducation = getHighestEducation(teacher.degrees ?? []);

  return {
    id: teacher._id.toString(),
    userId: teacher.userId._id?.toString?.() ?? teacher.userId.toString(),
    code: teacher.code,
    name: teacher.userId.name,
    email: teacher.userId.email,
    phoneNumber: teacher.userId.phoneNumber ?? "",
    address: teacher.userId.address ?? "",
    identity: teacher.userId.identity ?? "",
    dob: teacher.userId.dob ?? null,
    isActive: teacher.isActive,
    status: teacher.isActive ? "ACTIVE" : "INACTIVE",
    statusLabel: teacher.isActive ? "Dang cong tac" : "Ngung cong tac",
    startDate: teacher.startDate ?? null,
    endDate: teacher.endDate ?? null,
    teacherPositionsId: positions.map((position) => position.id),
    positions,
    teacherPositionNames: positions.map((position) => position.name),
    teacherPositionCodes: positions.map((position) => position.code),
    education,
    highestEducation: highestEducation
      ? {
          level: highestEducation.type ?? "",
          school: highestEducation.school ?? "",
          major: highestEducation.major ?? "",
          year: highestEducation.year ?? "",
          isGraduated: highestEducation.isGraduated ?? false,
        }
      : null,
  };
};

const generateUniqueTeacherCode = async () => {
  const maxAttempts = 20;

  for (let i = 0; i < maxAttempts; i += 1) {
    const code = crypto.randomInt(10000000, 100000000).toString();
    const exists = await Teacher.exists({ code });
    if (!exists) {
      return code;
    }
  }

  throw Object.assign(new Error("Khong the sinh ma giao vien duy nhat"), {
    statusCode: 500,
  });
};

const mapDegreesFromBody = (education = []) =>
  education
    .filter((item) => item && (item.level || item.school || item.major || item.year))
    .map(({ level, school, major, year, isGraduated }) => ({
      type: level?.trim?.() ?? "",
      school: school?.trim?.() ?? "",
      major: major?.trim?.() ?? "",
      year: year ? Number(year) : undefined,
      isGraduated: Boolean(isGraduated),
    }));

const normalizeTeacherPayload = (body) => ({
  name: body.name?.trim(),
  email: body.email?.trim().toLowerCase(),
  phoneNumber: body.phoneNumber?.trim() ?? "",
  address: body.address?.trim() ?? "",
  identity: body.identity?.trim() ?? "",
  dob: body.dob || null,
  isActive: body.isActive ?? true,
  teacherPositionsId: Array.isArray(body.teacherPositionsId)
    ? body.teacherPositionsId.filter(Boolean)
    : [],
  education: Array.isArray(body.education) ? mapDegreesFromBody(body.education) : [],
  startDate: body.startDate || null,
  endDate: body.endDate || null,
});

const validateTeacherPayload = ({ name, email }) => {
  if (!name) {
    throw Object.assign(new Error("Ten khong duoc de trong"), {
      statusCode: 400,
    });
  }

  if (!email) {
    throw Object.assign(new Error("Email khong duoc de trong"), {
      statusCode: 400,
    });
  }
};

const validateTeacherPositions = async (teacherPositionsId) => {
  if (!teacherPositionsId.length) {
    return;
  }

  const validCount = await TeacherPosition.countDocuments({
    _id: { $in: teacherPositionsId },
    isDeleted: false,
  });

  if (validCount !== teacherPositionsId.length) {
    throw Object.assign(new Error("Vi tri cong tac khong hop le"), {
      statusCode: 400,
    });
  }
};

const populateTeacherById = async (teacherId) =>
  Teacher.findById(teacherId)
    .populate({
      path: "userId",
      select: "name email phoneNumber address identity dob",
      match: { isDeleted: false },
    })
    .populate({
      path: "teacherPositionsId",
      select: "name code",
      match: { isDeleted: false },
    })
    .lean();

const ensureTeacherExists = async (id) => {
  const teacher = await Teacher.findOne({ _id: id, isDeleted: false });

  if (!teacher) {
    throw Object.assign(new Error("Khong tim thay giao vien"), {
      statusCode: 404,
    });
  }

  return teacher;
};

const ensureEmailAvailable = async (email, excludeUserId) => {
  const existingUser = await User.findOne({
    email,
    _id: { $ne: excludeUserId },
    isDeleted: false,
  }).lean();

  if (existingUser) {
    throw Object.assign(new Error("Email da ton tai"), {
      statusCode: 409,
    });
  }
};

export const createTeacher = async (body) => {
  const payload = normalizeTeacherPayload(body);

  validateTeacherPayload(payload);
  await ensureEmailAvailable(payload.email);
  await validateTeacherPositions(payload.teacherPositionsId);

  const code = await generateUniqueTeacherCode();

  const user = await User.create({
    name: payload.name,
    email: payload.email,
    phoneNumber: payload.phoneNumber,
    address: payload.address,
    identity: payload.identity,
    dob: payload.dob,
    role: "TEACHER",
  });

  try {
    const teacher = await Teacher.create({
      userId: user._id,
      code,
      isActive: payload.isActive,
      teacherPositionsId: payload.teacherPositionsId,
      degrees: payload.education,
      startDate: payload.startDate,
      endDate: payload.endDate,
    });

    const populated = await populateTeacherById(teacher._id);
    return mapTeacher(populated);
  } catch (error) {
    await User.findByIdAndDelete(user._id);

    if (error.code === 11000) {
      if (error.keyPattern?.email) {
        throw Object.assign(new Error("Email da ton tai"), { statusCode: 409 });
      }

      if (error.keyPattern?.code) {
        throw Object.assign(new Error("Ma giao vien da ton tai"), {
          statusCode: 409,
        });
      }
    }

    throw error;
  }
};

export const updateTeacher = async (id, body) => {
  const teacher = await ensureTeacherExists(id);
  const payload = normalizeTeacherPayload(body);

  validateTeacherPayload(payload);
  await validateTeacherPositions(payload.teacherPositionsId);
  await ensureEmailAvailable(payload.email, teacher.userId);

  const user = await User.findById(teacher.userId);

  if (!user || user.isDeleted) {
    throw Object.assign(new Error("Khong tim thay thong tin giao vien"), {
      statusCode: 404,
    });
  }

  user.name = payload.name;
  user.email = payload.email;
  user.phoneNumber = payload.phoneNumber;
  user.address = payload.address;
  user.identity = payload.identity;
  user.dob = payload.dob;
  user.role = "TEACHER";

  teacher.isActive = payload.isActive;
  teacher.teacherPositionsId = payload.teacherPositionsId;
  teacher.degrees = payload.education;
  teacher.startDate = payload.startDate;
  teacher.endDate = payload.endDate;

  try {
    await user.save();
    await teacher.save();

    const populated = await populateTeacherById(teacher._id);
    return mapTeacher(populated);
  } catch (error) {
    if (error.code === 11000 && error.keyPattern?.email) {
      throw Object.assign(new Error("Email da ton tai"), { statusCode: 409 });
    }

    throw error;
  }
};

export const deleteTeacher = async (id) => {
  const teacher = await ensureTeacherExists(id);
  const user = await User.findById(teacher.userId);

  teacher.isDeleted = true;
  if (user) {
    user.isDeleted = true;
    await user.save();
  }
  await teacher.save();

  const populated = await populateTeacherById(teacher._id);

  return {
    id: teacher._id.toString(),
    code: teacher.code,
    name: populated?.userId?.name ?? user?.name ?? "",
  };
};

export const getAllTeachers = async ({ page = 1, limit = 10 } = {}) => {
  const activeUsers = await User.find({ isDeleted: false }, { _id: 1 }).lean();
  const activeUserIds = activeUsers.map((user) => user._id);
  const filter = { userId: { $in: activeUserIds } };
  const skip = (page - 1) * limit;

  const [total, teachers] = await Promise.all([
    Teacher.countDocuments(filter),
    Teacher.find(filter)
      .populate({
        path: "userId",
        select: "name email phoneNumber address identity dob",
        match: { isDeleted: false },
      })
      .populate({
        path: "teacherPositionsId",
        select: "name code",
        match: { isDeleted: false },
      })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .lean(),
  ]);

  const data = teachers.filter((teacher) => teacher.userId).map(mapTeacher);

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
