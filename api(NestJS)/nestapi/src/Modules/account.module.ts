import { Module, HttpModule } from '@nestjs/common';
import { AccountController } from '../Controllers/account.controller';
import { User } from '../Models/Entity/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { UserService } from '../Services/user.service';
import { AuthService } from '../Services/auth.service';
import { jwtConstants } from '../constants';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from 'src/Strategy/jwt.strategy';
import { ConfigModule } from 'src/config/config.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]),
  JwtModule.register({
    secret: jwtConstants.secret,
    signOptions: { expiresIn: '3600s' }
  }), HttpModule, PassportModule, ConfigModule ],
  controllers: [AccountController],
  providers: [ UserService, AuthService, JwtStrategy],
})
export class AccountModule { }
