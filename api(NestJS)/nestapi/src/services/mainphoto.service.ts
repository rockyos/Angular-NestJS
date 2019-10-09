import { Injectable } from "@nestjs/common";
import { PhotoService } from "./photo.service";
import { PhotoDto } from "src/models/dto/photoDto";
import { Photo } from "src/models/entity/photo.entity";
import { Guid } from "guid-typescript";
import { Readable } from "stream";
import { UserService } from "./user.service";
import { JwtService } from "@nestjs/jwt";
const sharp = require("sharp");

@Injectable()
export class MainPhotoService {
    constructor(
        private readonly photoService: PhotoService,
        private readonly userService: UserService,
        private readonly jwtService: JwtService
    ) { }

    public async getPhotoAll(session: Photo[], authHeader: string): Promise<PhotoDto[]> {
        const username = this.getUserFromToken(authHeader);
        let photosInSession: Photo[] = session[username];
        const user = await this.userService.findByEmail(username);
        let photosInDb = await this.photoService.findAllByUser(user);
        if (photosInSession) {
            let hidePhotoFromSession: Photo[] = [];
            for (var photoItem of photosInSession) {
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
        for (var photoItem of photosInDb) {
            var newPhotoDto = new PhotoDto(photoItem.id, photoItem.guid, photoItem.originalname);
            photoDto.push(newPhotoDto);
        }
        return photoDto;
    }

    public async getImage(session: Photo[], id: string, width: string, authHeader: string): Promise<any> {
        const username = this.getUserFromToken(authHeader);
        let photoInDb = await this.photoService.findOneByGuid(id);
        if (!photoInDb) {
            let photoInSession: Photo[] = session[username];
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

    public async addPhotoToSession(photo: Photo, session: Photo[], authHeader: string): Promise<any> {
        const username = this.getUserFromToken(authHeader);
        let photoInSession: Photo[] = session[username];
        if (photoInSession) {
            photoInSession.push(this.upLoadFileToPhoto(photo));
            session[username] = photoInSession;
        } else {
            let photoInSession: Photo[] = [];
            photoInSession.push(this.upLoadFileToPhoto(photo));
            session[username] = photoInSession;
        }
    }

    public async savePhoto(session: Photo[], authHeader: string): Promise<any> {
        const username = this.getUserFromToken(authHeader);
        let photoInSession: Photo[] = session[username];
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

    public async deletePhoto(session: Photo[], id: string, authHeader: string): Promise<any> {
        const username = this.getUserFromToken(authHeader);
        let photoInSession: Photo[] = session[username];
        const photoInDb = await this.photoService.findOneByGuid(id);
        if (photoInDb) {
            photoInSession = session[username];
            if (!photoInSession) {
                photoInSession = [];
            }
            photoInSession.push(photoInDb);
            session[username] = photoInSession;
        } else {
            for (var photoItem of photoInSession) {
                if (photoItem.guid === id) {
                    const index = photoInSession.indexOf(photoItem);
                    session[username].splice(index);
                }
            }
        }
    }

    public async resetPhoto(session: Photo[], authHeader: string): Promise<any> {
        const username = this.getUserFromToken(authHeader);
        session[username] = undefined;
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

    private getUserFromToken(authHeader: string): string {
        const headerArray = authHeader.split(' ');
        const token = headerArray[1];
        const decodeInfo = this.jwtService.decode(token);
        return decodeInfo['username'];
    }
}