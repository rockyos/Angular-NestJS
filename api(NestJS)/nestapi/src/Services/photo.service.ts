import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Photo } from 'src/Models/Entity/photo.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PhotoService {
    constructor(
        @InjectRepository(Photo)
        private photoRepository: Repository<Photo>,
    ) { }

    async findAll(): Promise<Photo[]> {
        return await this.photoRepository.find();
    }

    // async savePhoto(photos: Photo[]): Promise<Photo[]>{
    //     return await this.photoRepository.save(photos);
    // }

    async create(photo: Photo): Promise<Photo>{
        return await this.photoRepository.save(photo);
    }

    async findOneByGuid(photo: Photo):Promise<Photo>{
        return await this.photoRepository.findOne({
            where:{
                guid: photo.guid,
            }
        });
    }

}
