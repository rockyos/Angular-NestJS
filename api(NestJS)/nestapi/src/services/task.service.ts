import { Injectable } from '@nestjs/common';
import { ConfigService } from 'src/config/config.service';
import { NestSchedule, Interval } from 'nest-schedule';
import { TokenResetService } from './tokenreset.service';
const config = new ConfigService();

@Injectable()
export class TaskService extends NestSchedule {
    constructor(
        private readonly tokenService: TokenResetService
    ) { super()}
    

    @Interval(config.TaskInterval)
    async deleteTokenTask() {
        await this.tokenService.deleteByExpires(config.MailLinkValid * 1000 * 3600);
        return false;
    }
}
