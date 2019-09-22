import { Module, CacheModule } from '@nestjs/common';
import { PhotoController } from '../controllers/photo.controller';
import { PhotoService } from '../services/photo.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MainPhotoService } from '../services/mainphoto.service'
import { ConfigModule } from 'src/config/config.module';
import { Photo } from 'src/models/entity/photo.entity';


@Module({
  imports: [TypeOrmModule.forFeature([Photo]), CacheModule.register(), ConfigModule],
  controllers: [PhotoController],
  providers: [PhotoService, MainPhotoService]
})
export class PhotoModule {}
