import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Token } from '../models/entity/token.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TokenService {
    constructor(
        @InjectRepository(Token)
        private tokenRepository: Repository<Token>,
    ) { }

    async findByToken(token: string): Promise<Token> {
        return await this.tokenRepository.findOne({
            where: {
                token: token,
            }
        });
    }
    
    async deleteByToken(token: Token): Promise<any>{
        return await this.tokenRepository.remove(token);
    }

    async create(resetToken: Token): Promise<Token> {
        return await this.tokenRepository.save(resetToken);
    }
}
