import Teacher from "../models/teacher.model.js";
import TeacherPosition from "../models/teacherPosition.model.js";

const mapTeacherPosition = (position) => ({
  id: position._id.toString(),
  code: position.code,
  name: position.name,
  des: position.des ?? "",
  isActive: position.isActive,
});

const normalizePositionPayload = ({ name, code, des, isActive }) => ({
  name: name?.trim(),
  code: code?.trim().toUpperCase(),
  des: des?.trim() ?? "",
  isActive: isActive ?? true,
});

const validateTeacherPositionPayload = ({ name, code }) => {
  if (!name) {
    throw Object.assign(new Error("Ten vi tri khong duoc de trong"), {
      statusCode: 400,
    });
  }

  if (!code) {
    throw Object.assign(new Error("Ma vi tri khong duoc de trong"), {
      statusCode: 400,
    });
  }
};

const ensurePositionCodeAvailable = async (code, excludeId) => {
  const existing = await TeacherPosition.findOne({
    code,
    _id: { $ne: excludeId },
  }).lean();

  if (existing) {
    throw Object.assign(new Error("Ma vi tri da ton tai"), {
      statusCode: 409,
    });
  }
};

export const getAllTeacherPositions = async () => {
  const activePositions = await TeacherPosition.find({ isDeleted: false })
    .sort({ createdAt: -1 })
    .lean();

  if (activePositions.length > 0) {
    return activePositions.map(mapTeacherPosition);
  }

  const positions = await TeacherPosition.find({})
    .sort({ createdAt: -1 })
    .lean();

  return positions.map(mapTeacherPosition);
};

export const createTeacherPosition = async (body) => {
  const payload = normalizePositionPayload(body);

  validateTeacherPositionPayload(payload);
  await ensurePositionCodeAvailable(payload.code);

  try {
    const position = await TeacherPosition.create(payload);
    return mapTeacherPosition(position.toObject());
  } catch (error) {
    if (error.code === 11000 && error.keyPattern?.code) {
      throw Object.assign(new Error("Ma vi tri da ton tai"), {
        statusCode: 409,
      });
    }

    throw error;
  }
};

export const updateTeacherPosition = async (id, body) => {
  const position = await TeacherPosition.findOne({
    _id: id,
    isDeleted: false,
  });

  if (!position) {
    throw Object.assign(new Error("Khong tim thay vi tri"), {
      statusCode: 404,
    });
  }

  const payload = normalizePositionPayload(body);

  validateTeacherPositionPayload(payload);
  await ensurePositionCodeAvailable(payload.code, id);

  position.name = payload.name;
  position.code = payload.code;
  position.des = payload.des;
  position.isActive = payload.isActive;

  try {
    await position.save();
    return mapTeacherPosition(position.toObject());
  } catch (error) {
    if (error.code === 11000 && error.keyPattern?.code) {
      throw Object.assign(new Error("Ma vi tri da ton tai"), {
        statusCode: 409,
      });
    }

    throw error;
  }
};

export const deleteTeacherPosition = async (id) => {
  const position = await TeacherPosition.findOne({
    _id: id,
    isDeleted: false,
  });

  if (!position) {
    throw Object.assign(new Error("Khong tim thay vi tri"), {
      statusCode: 404,
    });
  }

  const teacherUsingPosition = await Teacher.exists({
    isDeleted: false,
    teacherPositionsId: id,
  });

  if (teacherUsingPosition) {
    throw Object.assign(
      new Error("Khong the xoa vi tri dang duoc gan cho giao vien"),
      {
        statusCode: 409,
      },
    );
  }

  position.isDeleted = true;
  await position.save();

  return mapTeacherPosition(position.toObject());
};
