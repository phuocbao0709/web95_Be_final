<<<<<<< HEAD
import { Router } from "express";
import { getAllUsers } from "../controllers/user.controller.js";

const userRouter = Router();

userRouter.get("/", getAllUsers);
=======
import express from "express";
import { registerUser, loginUser } from "../controllers/user.controller.js";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);

>>>>>>> d34965cb5d130c9c19f4bff0ae28a688f501f659

export default userRouter;
