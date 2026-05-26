import { Router } from "express";
import {
  getTeachers,
  postTeacher,
  putTeacher,
  removeTeacher,
} from "../controllers/teacher.controller.js";

const teacherRouter = Router();

teacherRouter.get("/", getTeachers);
teacherRouter.post("/", postTeacher);
teacherRouter.put("/:id", putTeacher);
teacherRouter.delete("/:id", removeTeacher);

export default teacherRouter;
