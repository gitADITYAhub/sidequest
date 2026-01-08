import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { QuestService } from './quest.service';
import { QuestTemplate } from './quest-template.entity';

@Controller('quests')
export class QuestController {
    constructor(private readonly questService: QuestService) { }

    @Get('templates')
    findAllTemplates(): Promise<QuestTemplate[]> {
        return this.questService.findAllTemplates();
    }

    @Get('roll')
    rollQuest(): Promise<QuestTemplate> {
        return this.questService.rollQuest();
    }

    /**
     * Complete quest - creates pending entry
     */
    @Post('complete')
    async completeQuest(@Body() body: { userId: string; questId: number; proofVideoUrl: string }) {
        return this.questService.completeQuest(body.userId, body.questId, body.proofVideoUrl);
    }

    /**
     * Verify quest - simulates AI verification
     */
    @Post('verify/:completedQuestId')
    async verifyQuest(@Param('completedQuestId') completedQuestId: number) {
        return this.questService.verifyQuest(completedQuestId);
    }

    /**
     * Get all quests for a user
     */
    @Get('user/:userId')
    async getUserQuests(@Param('userId') userId: string) {
        const quests = await this.questService.getUserQuests(userId);
        return { quests };
    }
}
