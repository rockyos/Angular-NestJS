import { Module, HttpModule } from '@nestjs/common';
import { AccountController } from '../Controllers/account.controller';
import { User } from '../Models/Entity/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { UserService } from '../Services/user.service';
import { AuthService } from '../Services/auth.service';

@Module({
  imports: [TypeOrmModule.forFeature([User]),
  JwtModule.register({
    secret: '123456789ITSMYKEY'
  }), HttpModule],
  controllers: [AccountController],
  providers: [ UserService, AuthService],
})
export class AccountModule { }
