import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseConfig } from './config/database.config';
import { DatabaseService } from './database/connect';
import { authModule } from './modules/auth/auth.module';
import { UserModule } from './modules/users/users.module';
import { ChatGateway } from './socket/chat/chat.gateway';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    DatabaseConfig,
    authModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService, DatabaseService, ChatGateway],
})
export class AppModule {}
