import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PhotoService } from "./photo.service";
import { PhotoDto } from "src/Models/DTO/photoDto";
import { Photo } from "src/Models/Entity/photo.entity";
import { Guid } from "guid-typescript";

@Injectable()
export class MainPhotoService {
    constructor(
        private readonly photoService: PhotoService,
    ) { }


    public async getPhotoAll(): Promise<PhotoDto[]>{
        return await this.photoService.findAll();
    }

    public async saveOne(photo: Photo): Promise<any>{
        photo.guid = Guid.create().toString();
        const newPhoto = await this.photoService.create(photo);
        console.log(newPhoto);
        if(newPhoto){
            return 201;
        }
        throw new UnauthorizedException('Invalid login attempt!') 
    } 

}