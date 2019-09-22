import { Module, CacheModule } from '@nestjs/common';
import { PhotoController } from '../Controllers1/photo.controller';
import { PhotoService } from '../Services1/photo.service';
import { Photo } from '../Models/Entity/photo.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MainPhotoService } from '../Services1/mainphoto.service'
import { ConfigModule } from 'src/config/config.module';

@Module({
  imports: [TypeOrmModule.forFeature([Photo]), CacheModule.register(), ConfigModule],
  controllers: [PhotoController],
  providers: [PhotoService, MainPhotoService]
})
export class PhotoModule {}
