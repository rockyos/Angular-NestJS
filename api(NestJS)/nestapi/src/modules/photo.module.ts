import { Module, CacheModule } from '@nestjs/common';
import { PhotoController } from '../controllers/photo.controller';
import { PhotoService } from '../services/photo.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MainPhotoService } from '../services/mainphoto.service'
import { Photo } from 'src/models/entity/photo.entity';
import { LoggerModule } from './logger.module';
import { UserService } from 'src/services/user.service';
import { User } from 'src/models/entity/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from 'src/config/config.service';

const config = new ConfigService();

@Module({
  imports: [TypeOrmModule.forFeature([Photo, User]), JwtModule.register({
    secret: config.JwtSecretKey,
  }), CacheModule.register(), LoggerModule],
  controllers: [PhotoController],
  providers: [PhotoService, MainPhotoService, UserService]
})
export class PhotoModule { }
