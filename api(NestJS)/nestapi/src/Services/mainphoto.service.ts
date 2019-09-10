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


    public async getPhotoAll(session: Photo[]): Promise<PhotoDto[]> {
        let photoInSession: Photo[] = session[jwtConstants.sessionKey];
        let photosInDb = await this.photoService.findAll();
        if (photoInSession) {
            let hidePhotoFromSession: Photo[] = [];
            photoInSession.forEach(async photoItem => {
                const photoInDb = await this.photoService.findOneByGuid(photoItem.guid);
                if (photoInDb) {
                    const index = photosInDb.indexOf(photoInDb);
                    photosInDb.splice(index);
                    hidePhotoFromSession.push(photoItem);
                }
            });
            let removeArray: Photo[] = photoInSession.filter((item) => !hidePhotoFromSession.includes(item));
            removeArray.forEach(photoItem => {
                photosInDb.push(photoItem);
            });
        }
        let photoDto: PhotoDto[] = [];
        photosInDb.forEach(element => {
            var newPhotoDto = new PhotoDto(element.id, element.guid, element.originalname);
            photoDto.push(newPhotoDto);
        });
        return photoDto;
    }

    public async getImage(session: Photo[], id: string, width: string): Promise<any> {
        let photoInDb = await this.photoService.findOneByGuid(id);
        if (!photoInDb) {
            let photoInSession: Photo[] = session[jwtConstants.sessionKey];
            for (let photoItem of photoInSession) {
                if (photoItem.guid === id) {
                    photoInDb = photoItem;
                    var arrByte = Buffer.from(photoInDb.buffer);
                    photoInDb.buffer = arrByte;
                    break;
                }
            }
        }
        if (width) {
            const photoWidth = Number(width);
            const resizedPhoto = await sharp(photoInDb.buffer).resize(photoWidth).toBuffer();
            return this.getReadableStream(resizedPhoto);
        }
        return this.getReadableStream(photoInDb.buffer);
    }

    private getReadableStream(buffer: Buffer): Readable {
        const stream = new Readable();
        stream.push(buffer);
        stream.push(null);
        return stream;
    }


    private upLoadFileToPhoto(file: Photo) {
        var guid = Guid.create().toString();
        return new Photo(guid, file.originalname, file.buffer);
    }


    public async addPhotoToSession(photo: Photo, session: Photo[]): Promise<any> {
        let photoInSession: Photo[] = session[jwtConstants.sessionKey];
        if (photoInSession) {
            photoInSession.push(this.upLoadFileToPhoto(photo));
            session[jwtConstants.sessionKey] = photoInSession;
        } else {
            let photoInSession: Photo[] = [];
            photoInSession.push(this.upLoadFileToPhoto(photo));
            session[jwtConstants.sessionKey] = photoInSession;
        }
    }

    public async savePhoto(session: Photo[]): Promise<any> {
        let photoInSession: Photo[] = session[jwtConstants.sessionKey];
        if (photoInSession) {
            photoInSession.forEach(async photoItem => {
                const photoInDb = await this.photoService.findOneByGuid(photoItem.guid);
                if (photoInDb) {
                    await this.photoService.removePhoto(photoInDb);
                } else {
                    await this.photoService.addPhoto(photoItem);
                }
            });
            session[jwtConstants.sessionKey] = [];
        }
    }

    public async deletePhoto(session: Photo[], id: string): Promise<any> {
        let photoInSession: Photo[] = session[jwtConstants.sessionKey];
        const photoInDb = await this.photoService.findOneByGuid(id);
        if (photoInDb) {
            session[jwtConstants.sessionKey].push(photoInDb);
        } else {
            photoInSession.forEach(async photoItem => {
                if (photoItem.guid === id) {
                    const index = photoInSession.indexOf(photoItem);
                    session[jwtConstants.sessionKey].splice(index);
                }
            });
        }
    }

    public async resetPhoto(session: Photo[]): Promise<any> {
        session[jwtConstants.sessionKey] = [];
    }
}