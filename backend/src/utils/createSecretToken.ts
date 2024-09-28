import * as jwt from "jsonwebtoken";

const createSecretToken = (user: { id: number, email: string }) => {
  return jwt.sign(
    {
      userId: user.id,
      email: user.email,
    },
    process.env.JWT_SECRET as string,
    {
      expiresIn: "4h",
    });
};

export default createSecretToken;
