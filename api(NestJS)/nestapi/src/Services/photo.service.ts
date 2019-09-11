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

    async addPhoto(photo: Photo): Promise<Photo>{
        return await this.photoRepository.save(photo);
    }

    async findOneByGuid(guid: string):Promise<Photo>{
        return await this.photoRepository.findOne({
            where:{
                guid: guid,
            }
        });
    }

    async removePhoto(photo: Photo): Promise<Photo>{
        return await this.photoRepository.remove(photo);
    }
}
