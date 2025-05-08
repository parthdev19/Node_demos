// src/user/user.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './../../modules/users/users.schema';
import { signInData } from './../users/interfaces/user.interface';

@Injectable()
export class authService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(data: signInData): Promise<User> {
    return this.userModel.create(data);
  }

  async checkEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email });
  }
}
