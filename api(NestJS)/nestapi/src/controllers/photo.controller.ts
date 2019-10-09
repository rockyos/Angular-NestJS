import { Controller, Get, UseGuards, Post, UploadedFile, UseInterceptors, Param, Query, Res, Session, Delete, CacheInterceptor, Req } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import { Photo } from 'src/models/entity/photo.entity';
import { PhotoDto } from 'src/models/dto/photoDto';
import { MainPhotoService } from 'src/services/mainphoto.service';
import { LoggerService } from 'nest-logger';

@Controller('api/photo')
//@UseInterceptors(CacheInterceptor)
export class PhotoController {
     constructor(private readonly mainPhotoService: MainPhotoService, private readonly logger: LoggerService) { }

     @UseGuards(AuthGuard('jwt'))
     @Get()
     async getPhotoAsync(@Session() session: Photo[], @Req() request): Promise<PhotoDto[]> {
          const authHeader = request.headers.authorization;
          return await this.mainPhotoService.getPhotoAll(session, authHeader);
     }

     @UseGuards(AuthGuard('jwt'))
     @Get(':id')
     async getOnePhotoAsync(@Session() session: Photo[], @Param('id') id, @Query() query, @Res() res, @Req() request): Promise<any> {
          const photoWidth = query['width'];
          const authHeader = request.headers.authorization;
          const stream = await this.mainPhotoService.getImage(session, id, photoWidth, authHeader);
          return stream.pipe(res);
     }

     @UseGuards(AuthGuard('jwt'))
     @Post('send')
     @UseInterceptors(FileInterceptor('file'))
     async uploadPhoto(@UploadedFile() file: Photo, @Session() session: Photo[], @Req() request): Promise<any> {
          this.logger.info(`File ${file.originalname} was received`);
          const authHeader = request.headers.authorization;
          return await this.mainPhotoService.addPhotoToSession(file, session, authHeader);
     }

     @UseGuards(AuthGuard('jwt'))
     @Post('save')
     async savePhoto(@Session() session: Photo[], @Req() request): Promise<any> {
          const authHeader = request.headers.authorization;
          await this.mainPhotoService.savePhoto(session, authHeader);
          await this.mainPhotoService.resetPhoto(session, authHeader);
     }

     @UseGuards(AuthGuard('jwt'))
     @Delete(':id')
     async deletePhoto(@Param('id') id, @Session() session: Photo[], @Req() request): Promise<any> {
          const authHeader = request.headers.authorization;
          return await this.mainPhotoService.deletePhoto(session, id, authHeader);
     }

     @UseGuards(AuthGuard('jwt'))
     @Post('reset')
     async resetPhoto(@Session() session: Photo[], @Req() request): Promise<any> {
          const authHeader = request.headers.authorization;
          await this.mainPhotoService.resetPhoto(session, authHeader);
     }
}
