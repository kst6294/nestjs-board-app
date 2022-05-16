import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AccountRepository } from './account.repository';

@Module({
  imports: [TypeOrmModule.forFeature([AccountRepository])],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
