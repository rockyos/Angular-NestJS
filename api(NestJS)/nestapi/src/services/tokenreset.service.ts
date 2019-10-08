import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TokenReset } from '../models/entity/tokenreset.entity';
import { Repository, LessThan } from 'typeorm';
import { User } from 'src/models/entity/user.entity';

@Injectable()
export class TokenResetService {
    constructor(
        @InjectRepository(TokenReset)
        private tokenRepository: Repository<TokenReset>,
    ) { }

    async findByToken(token: string): Promise<TokenReset> {
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

    async deleteByToken(resetToken: TokenReset): Promise<any>{
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

    async create(resetToken: TokenReset): Promise<TokenReset> {
        return await this.tokenRepository.save(resetToken);
    }
}
