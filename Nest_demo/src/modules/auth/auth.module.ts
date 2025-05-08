import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { authController } from './auth.controller';
import { authService } from './auth.service';
import { User, UserSchema } from './../users/users.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [authController],
  providers: [authService],
})
export class authModule {}
