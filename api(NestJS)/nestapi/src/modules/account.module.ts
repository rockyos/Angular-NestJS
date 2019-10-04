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
import { TaskService } from '../services/task.service'
import { TokenReset } from 'src/models/entity/tokenreset.entity';
import { TokenResetService } from 'src/services/tokenreset.service';
import { LoggerModule } from './logger.module';

const config = new ConfigService();

@Module({
  imports: [TypeOrmModule.forFeature([User, TokenReset]), 
  JwtModule.register({
    secret: config.JwtSecretKey,
    signOptions: { expiresIn: config.JwtInspires }
  }), HttpModule, PassportModule, ConfigModule, LoggerModule ],
  controllers: [AccountController],
  providers: [ UserService, AuthService, TaskService, TokenResetService, JwtStrategy ],
})
export class AccountModule { }
