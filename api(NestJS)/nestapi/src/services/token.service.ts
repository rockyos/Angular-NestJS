import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Token } from '../models/entity/token.entity';
import { Repository, LessThan } from 'typeorm';
import { User } from 'src/models/entity/user.entity';

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
    
    async deleteByExpires(date: number): Promise<any[]>{
        const expiresDate = new Date(new Date().getTime() - date);
        const expires = await this.tokenRepository.find({
            where: {
                createDate: LessThan(expiresDate)
            }
        });
        return await this.tokenRepository.remove(expires);
    }

    async deleteByToken(resetToken: Token): Promise<any>{
        return await this.tokenRepository.remove(resetToken);
    }

    async deleteByUser(user: User): Promise<any>{
        const tokens = await this.tokenRepository.find({
            where:{
                user: user
            }
        });
        return await this.tokenRepository.remove(tokens);
    }

    async create(resetToken: Token): Promise<Token> {
        return await this.tokenRepository.save(resetToken);
    }
}
