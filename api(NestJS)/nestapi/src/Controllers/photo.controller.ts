import { Controller, Get, UseGuards, Post, UploadedFile, UseInterceptors, Param, Query, Res } from '@nestjs/common';
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
          const array = await this.mainPhotoService.getPhotoAll();
          console.log(array);
          return array;
     }

     @UseGuards(AuthGuard('jwt'))
     @Get(':id')
     async getOnePhotoAsync(@Param('id') id, @Query() query, @Res() res): Promise<any> {
          const stream = await this.mainPhotoService.getImage(id);
          return stream.pipe(res);
     }



     @UseGuards(AuthGuard('jwt'))
     @Post('send')
     @UseInterceptors(FileInterceptor('file'))
     async uploadPhoto(@UploadedFile() file: Photo): Promise<any> {
          return await this.mainPhotoService.saveOne(file);
     }


}
