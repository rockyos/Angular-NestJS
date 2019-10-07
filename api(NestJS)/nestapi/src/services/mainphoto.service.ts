import { Injectable } from "@nestjs/common";
import { PhotoService } from "./photo.service";
import { PhotoDto } from "src/models/dto/photoDto";
import { Photo } from "src/models/entity/photo.entity";
import { Guid } from "guid-typescript";
import { Readable } from "stream";
import { ConfigService } from "src/config/config.service";
import { UserService } from "./user.service";
const sharp = require("sharp");

@Injectable()
export class MainPhotoService {
    constructor(
        private readonly photoService: PhotoService,
        private readonly userService: UserService,
        private readonly config: ConfigService
    ) { }


    public async getPhotoAll(session: Photo[], username: string): Promise<PhotoDto[]> {
        let photosInSession: Photo[] = session[this.config.SessionKey];
        const user = await this.userService.findByEmail(username);
        let photosInDb = await this.photoService.findAllByUser(user);
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
            let photoInSession: Photo[] = session[this.config.SessionKey];
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
        let photoInSession: Photo[] = session[this.config.SessionKey];
        if (photoInSession) {
            photoInSession.push(this.upLoadFileToPhoto(photo));
            session[this.config.SessionKey] = photoInSession;
        } else {
            let photoInSession: Photo[] = [];
            photoInSession.push(this.upLoadFileToPhoto(photo));
            session[this.config.SessionKey] = photoInSession;
        }
    }

    public async savePhoto(session: Photo[], username: string): Promise<any> {
        let photoInSession: Photo[] = session[this.config.SessionKey];
        if (photoInSession) {
            for (var photoItem of photoInSession) {
                let photoInDb = await this.photoService.findOneByGuid(photoItem.guid);
                if (photoInDb) {
                    await this.photoService.removePhoto(photoInDb);
                } else {
                    var array = Buffer.from(photoItem.buffer)
                    photoItem.buffer = array;
                    const user = await this.userService.findByEmail(username);
                    photoItem.user = user; 
                    await this.photoService.addPhoto(photoItem);
                }
            }
        }
    }

    public async deletePhoto(session: Photo[], id: string): Promise<any> {
        let photoInSession: Photo[] = session[this.config.SessionKey];
        const photoInDb = await this.photoService.findOneByGuid(id);
        if (photoInDb) {
            photoInSession = session[this.config.SessionKey];
            if (!photoInSession) {
                photoInSession = [];
            }
            photoInSession.push(photoInDb);
            session[this.config.SessionKey] = photoInSession;
        } else {
            for(var photoItem of photoInSession){
                if (photoItem.guid === id) {
                    const index = photoInSession.indexOf(photoItem);
                    session[this.config.SessionKey].splice(index);
                }
            }
        }
    }

    public async resetPhoto(session: Photo[]): Promise<any> {
        session[this.config.SessionKey] = undefined;
    }
}