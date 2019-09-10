import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PhotoService } from "./photo.service";
import { PhotoDto } from "src/Models/DTO/photoDto";
import { Photo } from "src/Models/Entity/photo.entity";
import { Guid } from "guid-typescript";
import { Readable } from "stream";
import { jwtConstants } from "../constants"
const sharp = require("sharp");

@Injectable()
export class MainPhotoService {
    constructor(
        private readonly photoService: PhotoService,
    ) { }


    public async getPhotoAll(): Promise<PhotoDto[]> {
        const photo = await this.photoService.findAll();
        let photoDto: PhotoDto[] = [];
        photo.forEach(element => {
            var newPhotoDto = new PhotoDto(element.id, element.guid, element.originalname);
            photoDto.push(newPhotoDto);
        });
        return photoDto;
    }

    public async getImage(photoName: string, width: string): Promise<any> {
        if (width) {
            const photoWidth = Number(width);
            const data = (await this.photoService.findOneByGuid(photoName)).buffer;
            const resizedPhoto = await sharp(data).resize(photoWidth).toBuffer();
            return this.getReadableStream(resizedPhoto);
        }
        const data = (await this.photoService.findOneByGuid(photoName)).buffer;
        return this.getReadableStream(data);
    }

    private getReadableStream(buffer: Buffer): Readable {
        const stream = new Readable();
        stream.push(buffer);
        stream.push(null);
        return stream;
    }


    public async saveOne(photo: Photo): Promise<any> {
        photo.guid = Guid.create().toString();
        const newPhoto = await this.photoService.create(photo);
        if (newPhoto) {
            return 201;
        }
        throw new UnauthorizedException('Invalid login attempt!')
    }


    public async saveInSession(photo: Photo, session: Photo[]): Promise<any> {
        let photoInSession: Photo[] = session[jwtConstants.sessionKey];
        photo.guid = Guid.create().toString();
        if(photoInSession){
            photoInSession.push(photo);
        } else {
            session[jwtConstants.sessionKey] = photo;
        }
    }
}