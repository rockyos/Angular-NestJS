import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Photo } from 'src/models/entity/photo.entity';
import { Repository } from 'typeorm';
import { User } from 'src/models/entity/user.entity';

@Injectable()
export class PhotoService {
    constructor(
        @InjectRepository(Photo)
        private photoRepository: Repository<Photo>,
    ) { }

    async findAllByUser(user: User): Promise<Photo[]> {
        return await this.photoRepository.find({
            where:{
                user: user,
            }
        });
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
