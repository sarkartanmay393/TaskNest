import { Request, Response, NextFunction } from 'express';

export const catchAllMiddleware = (_: Request, res: Response) => {
  return res.status(404).json({
    error: "Not Found",
    message: "The requested URL or Method is mismatched with the server's API."
  });
}