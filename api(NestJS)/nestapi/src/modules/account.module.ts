import { Module, HttpModule } from '@nestjs/common';
import { AccountController } from '../controllers/account.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from 'src/strategy/jwt.strategy';
import { ConfigModule } from 'src/config/config.module';
import { User } from 'src/models/entity/user.entity';

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
