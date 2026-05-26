import express from "express";
<<<<<<< HEAD
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
=======
import { connectDB } from "./src/configs/db.js";
import userRouter from "./src/router/user.router.js";
import postRouter from "./src/router/post.router.js";
const app = express();
const PORT = 3003;

connectDB();


app.use(express.json());
>>>>>>> d34965cb5d130c9c19f4bff0ae28a688f501f659

app.get("/", (req, res) => {
  res.json({ message: "server is running" });
});

<<<<<<< HEAD
const startServer = async () => {
  await connectDB();
  app.listen(port, () => {
    console.log(`Server dang chay tai port ${port}`);
  });
};

startServer();
=======
app.use("/users", userRouter);
app.use("/posts", postRouter);

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});

>>>>>>> d34965cb5d130c9c19f4bff0ae28a688f501f659
