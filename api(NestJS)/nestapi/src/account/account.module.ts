import { Module, HttpModule } from '@nestjs/common';
import { AccountController } from './account.controller';
import { User } from './user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { UserService } from './user/user.service';
import { AuthService } from './auth/auth.service';

@Module({
  imports: [TypeOrmModule.forFeature([User]),
  JwtModule.register({
    secret: '123456789ITSMYKEY'
  }), HttpModule],
  controllers: [AccountController],
  providers: [ UserService, AuthService],
})
export class AccountModule { }
