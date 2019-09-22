import { Module, HttpModule } from '@nestjs/common';
import { AccountController } from '../Controllers1/account.controller';
import { User } from '../Models/Entity/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { UserService } from '../Services1/user.service';
import { AuthService } from '../Services1/auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from 'src/Strategy1/jwt.strategy';
import { ConfigModule } from 'src/config/config.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]),
  JwtModule.register({
    secret: '123456789ITSMYKEY',
    signOptions: { expiresIn: '3600s' }
  }), HttpModule, PassportModule, ConfigModule ],
  controllers: [AccountController],
  providers: [ UserService, AuthService, JwtStrategy],
})
export class AccountModule { }
