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
import { ConfigService } from 'src/config/config.service';
import { Token } from 'src/models/entity/token.entity'
import { TokenService } from '../services/token.service';

const config = new ConfigService();

@Module({
  imports: [TypeOrmModule.forFeature([User]), 
  TypeOrmModule.forFeature([Token]),
  JwtModule.register({
    secret: config.JwtSecretKey,
    signOptions: { expiresIn: config.JwtInspires }
  }), HttpModule, PassportModule, ConfigModule ],
  controllers: [AccountController],
  providers: [ UserService, AuthService, TokenService, JwtStrategy ],
})
export class AccountModule { }
