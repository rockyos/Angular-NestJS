import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../models/entity/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) { }

    async findByEmail(email: string): Promise<User> {
        return await this.userRepository.findOne({
            where: {
                email: email,
            }
        });
    }

    async findById(id: number): Promise<User> {
        return await this.userRepository.findOne({
            where: {
                id: id,
            }
        });
    }

    async createOrUpdate(user: User): Promise<User> {
        return await this.userRepository.save(user);
    }

}
