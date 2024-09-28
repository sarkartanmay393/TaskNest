import * as bcrypt from "bcryptjs";
import { ReqType, ResType } from "../types/index";
import createSecretToken from "../utils/createSecretToken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const logOut = async (req: ReqType, res: ResType) => {
  const { userid } = req.headers;
  if (!userid) {
    return res.status(400).json({ error: "User not authenticated" });
  }

  try {
    res.clearCookie("token");
    console.log(`Logout successful!`);
    return res.json(`Come back soon!`);
  } catch (error) {
    return res.status(401).json(`${error}`);
  }
};

const createUser = async (req: ReqType, res: ResType) => {
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

const loginUser = async (req: ReqType, res: ResType) => {
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
    const token = createSecretToken({ id: user.id, email: user.email });
    res.cookie("token", token, {
      maxAge: 1000 * 60 * 60 * 24 * 7,
      secure: true,
      sameSite: "none",
    });

    return res.status(200).json({ user, token });
  } catch (error) {
    console.log(error);
    return res.status(401).json ({ error: "Failed to login user", verbose: JSON.stringify(error) });
  }
};

export { createUser, loginUser, logOut };
