import * as dotenv from "dotenv";
dotenv.config();

import * as cors from "cors";
import express from "express";
import cookie from "cookie-parser";
import rateLimit from 'express-rate-limit';

import { createTask, deleteTask, updateTask, getAllTasks } from "./controllers/taskController";
import connectDatabase from "./utils/connectDatabase";
import { createUser, loginUser, logOut } from "./controllers/authController";
import { catchGlobalErrors } from "./middlewares/catchGlobalErrors";
import { catchAllMiddleware } from "./middlewares/catchAllMiddleware";
import authMiddleware from "./middlewares/authMiddleware";

const PORT = process.env.PORT || 8080;
const app = express();
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 250,
  message: {
    message: 'Too many requests, please try again later.',
    status: 429,
  }
});

// Middlewares
app.use(
  cors.default({
    origin: ["http://localhost:5173", "https://tsmk-voosho.vercel.app"],
    credentials: true,
  })
);
app.use(limiter);
app.use(cookie());
app.use(express.json());

app.get('/', (_, res) => {
  res.send('Welcome to the TSMK API!');
})

// Authentication
app.post("/v1/api/signup", createUser);
app.post("/v1/api/login", loginUser);

app.get("/v1/api/logout", authMiddleware, logOut);

// Task Management
app.get("/v1/api/task/get", authMiddleware, getAllTasks);
app.post("/v1/api/task/create", authMiddleware, createTask);
app.put("/v1/api/task/update/:id", authMiddleware, updateTask);
app.delete("/v1/api/task/delete/:id", authMiddleware, deleteTask);
app.post("/v1/api/task/bulkUpdate", authMiddleware, bulkUpdateTasks);

// Error handling
// app.use(catchAllMiddleware);
// app.use(catchGlobalErrors);

connectDatabase(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
  });
});
