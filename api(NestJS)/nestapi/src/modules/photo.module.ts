import { Module, CacheModule } from '@nestjs/common';
import { PhotoController } from '../controllers/photo.controller';
import { PhotoService } from '../services/photo.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MainPhotoService } from '../services/mainphoto.service'
import { ConfigModule } from 'src/config/config.module';
import { Photo } from 'src/models/entity/photo.entity';
import { LoggerModule } from './logger.module';
import { UserService } from 'src/services/user.service';
import { User } from 'src/models/entity/user.entity';



@Module({
  imports: [TypeOrmModule.forFeature([Photo, User]), CacheModule.register(), ConfigModule, LoggerModule],
  controllers: [PhotoController],
  providers: [PhotoService, MainPhotoService, UserService]
})
export class PhotoModule {}
