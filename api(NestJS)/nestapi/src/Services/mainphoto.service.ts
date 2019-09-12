import { Injectable } from "@nestjs/common";
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
        let photosInSession: Photo[] = session[jwtConstants.sessionKey];
        let photosInDb = await this.photoService.findAll();
        if (photosInSession) {
            let hidePhotoFromSession: Photo[] = [];
            for(var photoItem of photosInSession){
                const photo = photosInDb.filter((item) => item.guid == photoItem.guid);
                const index = photosInDb.indexOf(photo[0]);
                if (index != -1) {
                    photosInDb.splice(index);
                    hidePhotoFromSession.push(photoItem);
                }
            }
            let removeArray: Photo[] = photosInSession.filter((item) => !hidePhotoFromSession.includes(item));
            removeArray.forEach(photoItem => {
                photosInDb.push(photoItem);
            });
        }
        let photoDto: PhotoDto[] = [];
        for(var photoItem of photosInDb){
            var newPhotoDto = new PhotoDto(photoItem.id, photoItem.guid, photoItem.originalname);
            photoDto.push(newPhotoDto);
        }      
        return photoDto;
    }

    public async getImage(session: Photo[], id: string, width: string): Promise<any> {
        let photoInDb = await this.photoService.findOneByGuid(id);
        if (!photoInDb) {
            let photoInSession: Photo[] = session[jwtConstants.sessionKey];
            for (var photoItem of photoInSession) {
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
            for (var photoItem of photoInSession) {
                let photoInDb = await this.photoService.findOneByGuid(photoItem.guid);
                if (photoInDb) {
                    await this.photoService.removePhoto(photoInDb);
                } else {
                    var array = Buffer.from(photoItem.buffer)
                    photoItem.buffer = array;
                    await this.photoService.addPhoto(photoItem);
                }
            }
        }
    }

    public async deletePhoto(session: Photo[], id: string): Promise<any> {
        let photoInSession: Photo[] = session[jwtConstants.sessionKey];
        const photoInDb = await this.photoService.findOneByGuid(id);
        if (photoInDb) {
            photoInSession = session[jwtConstants.sessionKey];
            if (!photoInSession) {
                photoInSession = [];
            }
            photoInSession.push(photoInDb);
            session[jwtConstants.sessionKey] = photoInSession;
        } else {
            for(var photoItem of photoInSession){
                if (photoItem.guid === id) {
                    const index = photoInSession.indexOf(photoItem);
                    session[jwtConstants.sessionKey].splice(index);
                }
            }
        }
    }

    public async resetPhoto(session: Photo[]): Promise<any> {
        session[jwtConstants.sessionKey] = undefined;
    }
}