import { Injectable } from '@nestjs/common';
import { ConfigService } from 'src/config/config.service';
import { NestSchedule, Interval } from 'nest-schedule';
import { TokenService } from './token.service';
const config = new ConfigService();

@Injectable()
export class TaskService extends NestSchedule {
    constructor(
        private readonly tokenService: TokenService
    ) { super()}
    

    @Interval(config.TaskInterval * 1000 * 60)
    async deleteTokenTask() {
        await this.tokenService.deleteByExpires(config.MailLinkValid * 1000 * 3600);
    }
}
