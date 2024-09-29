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
const jwt = __importStar(require("jsonwebtoken"));
const firebase_admin_1 = __importDefault(require("../firebase-admin"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
exports.default = async (req, res, next) => {
    const { token } = req.cookies;
    if (!token) {
        console.log("no on-prem token");
        try {
            const token = req.headers['token'];
            const decodedToken = await firebase_admin_1.default.auth().verifyIdToken(token);
            const userConfig = await prisma.userConfig.findUnique({
                where: {
                    googleId: decodedToken.uid,
                }
            });
            if (!userConfig) {
                return res.status(401).json({ error: "User not authenticated" });
            }
            req.headers["userid"] = userConfig?.userId.toString();
            return next();
        }
        catch (err) {
            res.clearCookie("token");
            return res.status(401).json({ error: "User not authenticated", verbose: JSON.stringify(err) });
        }
    }
    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        req.headers["userid"] = decodedToken.userId;
        next();
    }
    catch (err) {
        res.clearCookie("token");
        return res.status(401).send(`${err}`);
    }
    // return res.status(500).json(`middleware error: auth verify`);
};
