import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuestService } from './quest.service';
import { QuestController } from './quest.controller';
import { QuestTemplate } from './quest-template.entity';
import { ActiveQuest } from './active-quest.entity';
import { CompletedQuest } from './completed-quest.entity';
import { VerificationModule } from '../verification/verification.module';
import { UserModule } from '../user/user.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([QuestTemplate, ActiveQuest, CompletedQuest]),
        VerificationModule,
        UserModule,
    ],
    providers: [QuestService],
    controllers: [QuestController],
    exports: [QuestService],
})
export class QuestModule { }
