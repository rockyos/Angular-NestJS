import { Controller, Get, UseGuards, Post, UploadedFile, UseInterceptors, Request, Body, Param, Query } from '@nestjs/common';
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
     async getPhotoAsync(): Promise<PhotoDto[]> {
         return await this.mainPhotoService.getPhotoAll();
     }

     @UseGuards(AuthGuard('jwt'))
     @Get(':id')
     async getOnePhotoAsync(@Param('id') id, @Query() query): Promise<any> {
          console.log(id, '  ', query['width']);
         //await this.mainPhotoService.getPhotoAll();
         return 200;
     }



     @UseGuards(AuthGuard('jwt'))
     @Post('send')
     @UseInterceptors(FileInterceptor('file'))
     async uploadPhoto(@UploadedFile() file: Photo): Promise<any> {
          return await this.mainPhotoService.saveOne(file);
     }


}
