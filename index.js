import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./src/configs/db.js";
import teacherRouter from "./src/router/teacher.router.js";
import teacherPositionRouter from "./src/router/teacherPosition.router.js";
import userRouter from "./src/router/user.router.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3003;

app.use(express.json());
app.use("/teachers", teacherRouter);
app.use("/teacher-positions", teacherPositionRouter);
app.use("/user", userRouter);

app.get("/", (req, res) => {
  res.json({ message: "server is running" });
});

const startServer = async () => {
  await connectDB();
  app.listen(port, () => {
    console.log(`Server dang chay tai port ${port}`);
  });
};

startServer();
