import { Module } from '@nestjs/common';
import { TaskService } from 'src/services/task.service';
import { TokenResetService } from 'src/services/tokenreset.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TokenReset } from 'src/models/entity/tokenreset.entity';
import { ConfigModule } from 'src/config/config.module';

@Module({
    imports:[TypeOrmModule.forFeature([TokenReset]), ConfigModule],
    providers: [TaskService, TokenResetService]
})
export class TaskModule {}
