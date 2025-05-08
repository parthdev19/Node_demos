import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './users.schema';
// import { changePasswordDto } from './dto/users.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findUserById(user_id: string): Promise<User | null> {
    return this.userModel.findOne({ _id: user_id });
  }

  async changePassword(
    userId: string,
    data: { newPassword: string },
  ): Promise<User | null> {
    return this.userModel.findOneAndUpdate(
      { _id: userId },
      { password: data?.newPassword },
    );
  }
}
