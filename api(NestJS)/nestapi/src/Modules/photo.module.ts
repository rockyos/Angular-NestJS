import { Module } from '@nestjs/common';
import { PhotoController } from '../Controllers/photo.controller';
import { PhotoService } from '../Services/photo.service';

@Module({
  controllers: [PhotoController],
  providers: [PhotoService]
})
export class PhotoModule {}
