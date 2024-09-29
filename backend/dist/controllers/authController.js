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
exports.logOut = exports.loginUser = exports.createUser = void 0;
const bcrypt = __importStar(require("bcryptjs"));
const createSecretToken_1 = __importDefault(require("../utils/createSecretToken"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const logOut = async (req, res) => {
    const { userid } = req.headers;
    if (!userid) {
        return res.status(400).json({ error: "User not authenticated" });
    }
    try {
        res.clearCookie("token");
        console.log(`Logout successful!`);
        return res.json({ message: "Come back soon!", status: "success" });
    }
    catch (error) {
        return res.status(401).json({ error: `${error}`, status: "failed" });
    }
};
exports.logOut = logOut;
const createUser = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        if (!email || !password) {
            res.status(400).json({ error: "Missing required fields" });
            return;
        }
        if (!email.includes("@")) {
            res.status(400).json({ error: "Invalid email" });
            return;
        }
        // if (!password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)) {
        //   res.status(400).json({ error: "" });
        //   return;
        // }
        const userExists = await prisma.user.findFirst({
            where: { email },
        });
        if (userExists) {
            res.status(400).json({ error: "User already exists" });
            return;
        }
        const hashedPassword = await bcrypt.hash(password, 8);
        const user = await prisma.user.create({
            data: {
                name: 'TSX Test User',
                email,
                password: hashedPassword,
            },
        });
        return res.json({ user });
    }
    catch (error) {
        return res.status(401).json({ error: "Failed to create user", verbose: JSON.stringify(error) });
    }
};
exports.createUser = createUser;
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    console.log('loginUser');
    if (!email || !password) {
        res.status(400).json({ error: "Missing required fields" });
        return;
    }
    if (!email.includes("@")) {
        return res.status(400).json({ error: "Invalid email" });
    }
    try {
        const user = await prisma.user.findFirst({
            where: { email },
        });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        const passwordMatched = await bcrypt.compare(password, user.password);
        if (!passwordMatched) {
            return res.status(401).json({ error: "Incorrect password" });
        }
        //Send the jwt token on successful login
        const token = (0, createSecretToken_1.default)({ id: user.id, email: user.email });
        res.cookie("token", token, {
            maxAge: 1000 * 60 * 60 * 24 * 7,
            secure: true,
            sameSite: "none",
        });
        return res.status(200).json({ user, token });
    }
    catch (error) {
        console.log(error);
        return res.status(401).json({ error: "Failed to login user", verbose: JSON.stringify(error) });
    }
};
exports.loginUser = loginUser;
