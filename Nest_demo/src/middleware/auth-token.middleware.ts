import { Request, Response, NextFunction } from 'express';
import { NestMiddleware, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import * as jwt from 'jsonwebtoken';
import { User, UserDocument } from './../modules/users/users.schema';

@Injectable()
export class AuthTokenMiddleware implements NestMiddleware {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async use(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const bearerHeader = req.headers['authorization'];

      if (!bearerHeader || !bearerHeader.startsWith('Bearer ')) {
        res.status(401).json({
          success: false,
          message: `Authorization header is missing or invalid.`,
        });
        return;
      }

      const bearerToken = bearerHeader.split(' ')[1];

      if (!bearerToken || bearerToken.trim() === '') {
        res.status(401).json({
          success: false,
          message: `Token is missing in the authorization header.`,
        });
        return;
      }

      let decoded: jwt.JwtPayload;
      try {
        decoded = jwt.verify(
          bearerToken,
          process.env.TOKEN_KEY || 'helirbn@12ih2jnei3n2883!nfbb',
        ) as jwt.JwtPayload;
      } catch (err: unknown) {
        const error = err as jwt.JsonWebTokenError;
        console.error('JWT verification error:', error.message);
        res.status(401).json({
          success: false,
          message: `Invalid or malformed token: ${error.message}`,
        });
        return;
      }

      const user = await this.userModel.findById(decoded.user_id).exec();

      if (!user) {
        res.status(401).json({
          success: false,
          message: 'User not found for the provided token.',
        });
        return;
      }

      req.user = user;
      next();
    } catch (error: unknown) {
      const err = error as Error;
      console.error('Unexpected error in AuthTokenMiddleware:', err.message);
      res.status(500).json({
        success: false,
        message: 'An unexpected error occurred during authentication.',
      });
    }
  }
}
