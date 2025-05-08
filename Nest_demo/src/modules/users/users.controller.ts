import { Controller, Post, Body, Req } from '@nestjs/common';
import { UserService } from './users.service';
import { changePasswordDto } from './dto/users.dto';
import { Request } from 'express';
import { RequestWithUser } from './interfaces/user.interface';

@Controller('api/user')
export class usersController {
  constructor(private readonly userService: UserService) {}

  @Post(`/change_password`)
  async changePassword(
    @Body() data: changePasswordDto,
    @Req() req: RequestWithUser,
  ) {
    const userId = req.user._id;

    if (!userId) {
      return {
        status: false,
        message: 'User not found',
      };
    }

    const findUser = await this.userService.findUserById(userId);

    if (!findUser) {
      return {
        status: false,
        message: 'User not found',
        data: null,
      };
    }

    if (findUser.password !== data.oldPassword) {
      return {
        status: false,
        message: 'Old password is incorrect',
        data: null,
      };
    }

    const user = await this.userService.changePassword(userId, {
      newPassword: data.newPassword,
    });

    if (user) {
      return {
        success: true,
        message: 'Password changed successfully',
        data: null,
      };
    } else {
      return {
        success: true,
        message: 'Password changed successfully',
        data: null,
      };
    }
  }
}
