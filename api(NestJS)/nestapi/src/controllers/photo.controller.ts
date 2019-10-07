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
          const username = request.user.username;
          return await this.mainPhotoService.getPhotoAll(session, username);
     }

     @UseGuards(AuthGuard('jwt'))
     @Get(':id')
     async getOnePhotoAsync(@Session() session: Photo[], @Param('id') id, @Query() query, @Res() res, @Req() request): Promise<any> {
          const photoWidth = query['width'];
          const username = request.user.username;
          const stream = await this.mainPhotoService.getImage(session, id, photoWidth, username);
          return stream.pipe(res);
     }

     @UseGuards(AuthGuard('jwt'))
     @Post('send')
     @UseInterceptors(FileInterceptor('file'))
     async uploadPhoto(@UploadedFile() file: Photo, @Session() session: Photo[], @Req() request): Promise<any> {
          this.logger.info(`File ${file.originalname} was received`);
          const username = request.user.username;
          return await this.mainPhotoService.addPhotoToSession(file, session, username);
     }

     @UseGuards(AuthGuard('jwt'))
     @Post('save')
     async savePhoto(@Session() session: Photo[], @Req() request): Promise<any> {
          const username = request.user.username;
          await this.mainPhotoService.savePhoto(session, username);
          await this.mainPhotoService.resetPhoto(session, username);
     }

     @UseGuards(AuthGuard('jwt'))
     @Delete(':id')
     async deletePhoto(@Param('id') id, @Session() session: Photo[], @Req() request): Promise<any> {
          const username = request.user.username;
          return await this.mainPhotoService.deletePhoto(session, id, username);
     }

     @UseGuards(AuthGuard('jwt'))
     @Post('reset')
     async resetPhoto(@Session() session: Photo[], @Req() request): Promise<any> {
          const username = request.user.username;
          await this.mainPhotoService.resetPhoto(session, username);
     }
}
