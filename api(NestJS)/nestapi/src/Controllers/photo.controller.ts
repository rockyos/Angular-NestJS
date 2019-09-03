import { Controller, Get, UseGuards } from '@nestjs/common';
import { PhotoService } from 'src/Services/photo.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('api/photo')
export class PhotoController {
    constructor(private readonly authService: PhotoService) { }

    @UseGuards(AuthGuard('jwt'))
    @Get()
    getAsync() {
         return 'Ok go into GET()'
    }


}
