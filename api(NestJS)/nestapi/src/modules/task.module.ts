import { Module } from '@nestjs/common';
import { TaskService } from 'src/services/task.service';
import { TokenService } from 'src/services/token.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Token } from 'src/models/entity/token.entity';
import { ConfigModule } from 'src/config/config.module';

@Module({
    imports:[TypeOrmModule.forFeature([Token]), ConfigModule],
    providers: [TaskService, TokenService]
})
export class TaskModule {}
