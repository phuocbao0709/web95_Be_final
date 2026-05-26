import { Router } from "express";
import {
  getTeacherPositions,
  postTeacherPosition,
  putTeacherPosition,
  removeTeacherPosition,
} from "../controllers/teacherPosition.controller.js";

const teacherPositionRouter = Router();

teacherPositionRouter.get("/", getTeacherPositions);
teacherPositionRouter.post("/", postTeacherPosition);
teacherPositionRouter.put("/:id", putTeacherPosition);
teacherPositionRouter.delete("/:id", removeTeacherPosition);

export default teacherPositionRouter;
