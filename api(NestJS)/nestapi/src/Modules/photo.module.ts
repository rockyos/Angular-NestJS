import { Module, CacheModule } from '@nestjs/common';
import { PhotoController } from '../Controllers/photo.controller';
import { PhotoService } from '../Services/photo.service';
import { Photo } from '../Models/Entity/photo.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MainPhotoService } from '../Services/mainphoto.service'

@Module({
  imports: [TypeOrmModule.forFeature([Photo]), CacheModule.register()],
  controllers: [PhotoController],
  providers: [PhotoService, MainPhotoService]
})
export class PhotoModule {}
