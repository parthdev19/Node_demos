import 'reflect-metadata';
import { IsNotEmpty, MinLength } from 'class-validator';

export class changePasswordDto {
  @IsNotEmpty()
  oldPassword!: string;

  @IsNotEmpty()
  @MinLength(6)
  newPassword!: string;
}
