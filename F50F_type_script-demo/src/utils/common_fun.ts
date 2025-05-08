import { Request, Response, NextFunction } from "express";

export const asyncHandler =
  (fn: Function) => (req: Request, res: Response, next: NextFunction) =>
    Promise.resolve(fn(req, res, next)).catch(next);

export const generateInviteCode = async () => {
  const prefix = process.env.PREFIX;
  const randomDigits = Array.from({ length: 7 }, () =>
    Math.floor(Math.random() * 10)
  ).join("");
  return prefix + randomDigits;
};
