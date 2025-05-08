import { Controller, Post, Body } from '@nestjs/common';
import { authService } from './auth.service';
import { generateToken } from './../../shared/utils/token.utils';
// import { signInData } from './../users/interfaces/user.interface';
import { SignUpDto, SignInDto } from './auth.dto';

@Controller('api/auth')
export class authController {
  constructor(private readonly authService: authService) {}

  @Post(`/sign_up`)
  async create(@Body() data: SignUpDto) {
    const checkEmail = await this.authService.checkEmail(data.email);

    if (checkEmail) {
      return { success: false, message: 'Email already exists', data: null };
    }

    const createUser = await this.authService.create(data);
    if (createUser) {
      const token: string = generateToken({
        user_id: createUser._id as string,
      });

      return {
        success: true,
        message: 'User created successfully',
        data: { token },
      };
    } else {
      return {
        message: 'User not created',
      };
    }
  }

  @Post(`/sign_in`)
  async signIn(@Body() data: SignInDto) {
    const checkEmail = await this.authService.checkEmail(data.email);

    if (!checkEmail) {
      return { success: false, message: 'Email not found', data: null };
    }

    if (checkEmail.password !== data.password) {
      return {
        success: false,
        message: 'Email and password are incorrect',
        data: null,
      };
    }

    const token: string = generateToken({
      user_id: checkEmail._id as string,
    });

    return {
      success: true,
      message: 'User signed in successfully',
      data: { token },
    };
  }
}
