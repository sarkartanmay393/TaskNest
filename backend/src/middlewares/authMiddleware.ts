import * as jwt from "jsonwebtoken";
import { NextFunction } from "express";
import { ReqType, ResType } from "../types";
import admin from "../firebase-admin";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async (req: ReqType, res: ResType, next: NextFunction) => {
  const { token } = req.cookies as { token: string };
  if (!token) {
    console.log("no on-prem token");
    try {
      const token = req.headers['token'] as string;
      const decodedToken = await admin.auth().verifyIdToken(token);
      const userConfig = await prisma.userConfig.findUnique({
        where: {
          googleId: decodedToken.uid,
        }
      })

      if (!userConfig) {
        return res.status(401).json({ error: "User not authenticated" });
      }

      req.headers["userid"] = userConfig?.userId.toString();
      return next();
    } catch (err) {
      res.clearCookie("token");
      return res.status(401).json({ error: "User not authenticated", verbose: JSON.stringify(err) });
    }
  }

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET as string) as {
      email: string;
      userId: string;
    };
    req.headers["userid"] = decodedToken.userId;
    next();
  } catch (err) {
    res.clearCookie("token");
    return res.status(401).send(`${err}`);
  }

  // return res.status(500).json(`middleware error: auth verify`);
};
