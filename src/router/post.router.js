import express from "express";
import { createPost, updatePost } from "../controllers/post.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const postRouter = express.Router();

postRouter.post("/", authMiddleware, createPost);
postRouter.put("/:id", authMiddleware, updatePost);

export default postRouter;
