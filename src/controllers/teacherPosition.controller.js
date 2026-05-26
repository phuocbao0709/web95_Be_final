import {
  createTeacherPosition,
  deleteTeacherPosition,
  getAllTeacherPositions,
  updateTeacherPosition,
} from "../services/teacherPosition.service.js";

export const getTeacherPositions = async (req, res) => {
  try {
    const data = await getAllTeacherPositions();
    res.status(200).json({
      message: "Lay danh sach vi tri cong tac thanh cong",
      data,
    });
  } catch (error) {
    res.status(500).json({
      message: "Loi khi lay danh sach vi tri cong tac",
      error: error.message,
    });
  }
};

export const postTeacherPosition = async (req, res) => {
  try {
    const data = await createTeacherPosition(req.body);
    res.status(201).json({
      message: "Tao vi tri cong tac thanh cong",
      data,
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      message:
        statusCode === 500 ? "Loi khi tao vi tri cong tac" : error.message,
      error: error.message,
    });
  }
};

export const putTeacherPosition = async (req, res) => {
  try {
    const data = await updateTeacherPosition(req.params.id, req.body);
    res.status(200).json({
      message: "Cap nhat vi tri cong tac thanh cong",
      data,
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      message:
        statusCode === 500 ? "Loi khi cap nhat vi tri cong tac" : error.message,
      error: error.message,
    });
  }
};

export const removeTeacherPosition = async (req, res) => {
  try {
    const data = await deleteTeacherPosition(req.params.id);
    res.status(200).json({
      message: "Xoa vi tri cong tac thanh cong",
      data,
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      message:
        statusCode === 500 ? "Loi khi xoa vi tri cong tac" : error.message,
      error: error.message,
    });
  }
};
