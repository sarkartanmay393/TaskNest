import * as jwt from "jsonwebtoken";
import { NextFunction } from "express";
import { ReqType, ResType } from "../types";

export default async (req: ReqType, res: ResType, next: NextFunction) => {
  const { token } = req.cookies as { token: string };
  if (!token) {
    console.log("no token");
    return res.status(401).json({ error: "User not authenticated" });
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
