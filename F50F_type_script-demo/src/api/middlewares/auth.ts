import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import users from "./../models/user.model";
import { errorRes, authFailRes } from "../../utils/response_formate";

interface AuthRequest extends Request {
  user?: any;
}

const auth = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const bearerHeader = req.headers["authorization"];

    if (!bearerHeader) {
      return errorRes(res, `A token is required for authentication.`);
    }

    const bearer = bearerHeader.split(" ");
    const bearerToken = bearer[1];

    const decoded = jwt.verify(
      bearerToken,
      process.env.TOKEN_KEY as string
    ) as JwtPayload;
    const { id } = decoded;

    const findUsers = await users
      .findById(id)
      .where({ is_deleted: false, is_block_by_admin: false });
      
      if (!findUsers) {
        return authFailRes(res, "Authentication failed.");
      }
      
      req.user = findUsers;
      
    next();
  } catch (error) {
    if (error instanceof Error && error.message === "jwt malformed") {
      return authFailRes(res, "Authentication failed.");
    }

    console.error("JWT Error:", error instanceof Error ? error.message : error);
    return errorRes(res, "Internal server error");
  }
};

export default auth;
