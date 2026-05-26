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
      error: error.message,
    });
  }
};
