import { Request, Response, NextFunction } from 'express';

export const catchGlobalErrors = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack); // Log the error details

  res.status(err.status || 500).json({
    error: err.message || "Internal Server Error",
    message: err.message || "An unexpected error occurred."
  });
}