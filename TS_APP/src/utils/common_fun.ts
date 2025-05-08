import { Request, Response, NextFunction } from "express";
import bcrypt from 'bcrypt';

// For handling the routes
export const asyncHandler =
  (fn: Function) => (req: Request, res: Response, next: NextFunction) =>
    Promise.resolve(fn(req, res, next)).catch(next);

// for generating invite code
export const generateInviteCode = async () => {
  const prefix = process.env.PREFIX;
  const randomDigits = Array.from({ length: 7 }, () =>
    Math.floor(Math.random() * 10)
  ).join("");
  return prefix + randomDigits;
};

// For encrypting and decrypting passwords
export const encryptPassword = async (password: string): Promise<string> => {
  const saltRounds = 10;
  const hashedPassword: string = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
};




