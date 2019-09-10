import { Controller, Get, UseGuards, Post, UploadedFile, UseInterceptors, Param, Query, Res, Session, Delete } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import { Photo } from 'src/Models/Entity/photo.entity';
import { PhotoDto } from 'src/Models/DTO/photoDto';
import { MainPhotoService } from 'src/Services/mainphoto.service';

@Controller('api/photo')
export class PhotoController {
     constructor(private readonly mainPhotoService: MainPhotoService) { }

     @UseGuards(AuthGuard('jwt'))
     @Get()
     async getPhotoAsync(@Session() session: Photo[]): Promise<PhotoDto[]> {
          return await this.mainPhotoService.getPhotoAll(session);
     }

     @UseGuards(AuthGuard('jwt'))
     @Get(':id')
     async getOnePhotoAsync(@Session() session: Photo[],@Param('id') id, @Query() query, @Res() res): Promise<any> {
          const photoWidth = query['width'];
          const stream = await this.mainPhotoService.getImage(session, id, photoWidth);
          return stream.pipe(res);
     }

     @UseGuards(AuthGuard('jwt'))
     @Post('send')
     @UseInterceptors(FileInterceptor('file'))
     async uploadPhoto(@UploadedFile() file: Photo, @Session() session: Photo[]): Promise<any> {
          return await this.mainPhotoService.addPhotoToSession(file, session);
          //session['photos'] = file;
          //  return await this.mainPhotoService.saveOne(file);
     }

     @UseGuards(AuthGuard('jwt'))
     @Post('save')
     async savePhoto(@Session() session: Photo[]): Promise<any>{
          return await this.mainPhotoService.savePhoto(session);
     }

     @UseGuards(AuthGuard('jwt'))
     @Delete(':id')
     async deletePhoto(@Param('id') id, @Session() session: Photo[]): Promise<any>{
          return await this.mainPhotoService.deletePhoto(session, id);
     }

     @UseGuards(AuthGuard('jwt'))
     @Post('reset')
     async resetPhoto(@Session() session: Photo[]): Promise<any>{
          session = [];
     }
}
