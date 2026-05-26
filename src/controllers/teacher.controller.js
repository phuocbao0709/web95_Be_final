import {
  createTeacher,
  deleteTeacher,
  getAllTeachers,
  updateTeacher,
} from "../services/teacher.service.js";

export const getTeachers = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.max(1, parseInt(req.query.limit, 10) || 10);

    const { data, pagination } = await getAllTeachers({ page, limit });
    res.status(200).json({
      message: "Lay danh sach giao vien thanh cong",
      data,
      pagination,
    });
  } catch (error) {
    res.status(500).json({
      message: "Loi khi lay danh sach giao vien",
      error: error.message,
    });
  }
};

export const postTeacher = async (req, res) => {
  try {
    const data = await createTeacher(req.body);
    res.status(201).json({
      message: "Tao giao vien thanh cong",
      data,
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      message: statusCode === 500 ? "Loi khi tao giao vien" : error.message,
      error: error.message,
    });
  }
};

export const putTeacher = async (req, res) => {
  try {
    const data = await updateTeacher(req.params.id, req.body);
    res.status(200).json({
      message: "Cap nhat giao vien thanh cong",
      data,
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      message: statusCode === 500 ? "Loi khi cap nhat giao vien" : error.message,
      error: error.message,
    });
  }
};

export const removeTeacher = async (req, res) => {
  try {
    const data = await deleteTeacher(req.params.id);
    res.status(200).json({
      message: "Xoa giao vien thanh cong",
      data,
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      message: statusCode === 500 ? "Loi khi xoa giao vien" : error.message,
      error: error.message,
    });
  }
};
