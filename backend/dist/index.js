"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const cors = __importStar(require("cors"));
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
// import rateLimit from 'express-rate-limit';
const taskController_1 = require("./controllers/taskController");
const connectDatabase_1 = __importDefault(require("./utils/connectDatabase"));
const authController_1 = require("./controllers/authController");
// import { catchGlobalErrors } from "./middlewares/catchGlobalErrors";
// import { catchAllMiddleware } from "./middlewares/catchAllMiddleware";
const authMiddleware_1 = __importDefault(require("./middlewares/authMiddleware"));
const PORT = process.env.PORT || 8080;
const app = (0, express_1.default)();
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000,
//   max: 250,
//   message: {
//     message: 'Too many requests, please try again later.',
//     status: 429,
//   }
// });
// Middlewares
app.use(cors.default({
    origin: ["http://localhost:5173", "https://tsmk-voosho.vercel.app", "https://tsmk-dnd.vercel.app"],
    credentials: true,
}));
// app.use(limiter);
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
app.get('/', (_, res) => {
    res.send('Welcome to the TSMK API!');
});
// Authentication
app.post("/v1/api/signup", authController_1.createUser);
app.post("/v1/api/login", authController_1.loginUser);
app.post("/v1/api/storeGoogleId", authController_1.storeGoogleId);
app.get("/v1/api/logout", authMiddleware_1.default, authController_1.logOut);
// Task Management
app.get("/v1/api/task/get", authMiddleware_1.default, taskController_1.getAllTasks);
app.post("/v1/api/task/create", authMiddleware_1.default, taskController_1.createTask);
app.put("/v1/api/task/update/:id", authMiddleware_1.default, taskController_1.updateTask);
app.delete("/v1/api/task/delete/:id", authMiddleware_1.default, taskController_1.deleteTask);
app.post("/v1/api/task/bulkUpdate", authMiddleware_1.default, taskController_1.bulkUpdateTasks);
// Error handling
// app.use(catchAllMiddleware);
// app.use(catchGlobalErrors);
(0, connectDatabase_1.default)(() => {
    app.listen(PORT, () => {
        console.log(`🚀 Server is running on port ${PORT}`);
    });
});
exports.default = app;
