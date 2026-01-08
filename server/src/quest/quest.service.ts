import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QuestTemplate } from './quest-template.entity';
import { ActiveQuest } from './active-quest.entity';
import { CompletedQuest } from './completed-quest.entity';
import { VerificationService } from '../verification/verification.service';
import { UserService } from '../user/user.service';

@Injectable()
export class QuestService {
    constructor(
        @InjectRepository(QuestTemplate)
        private questTemplateRepository: Repository<QuestTemplate>,
        @InjectRepository(ActiveQuest)
        private activeQuestRepository: Repository<ActiveQuest>,
        @InjectRepository(CompletedQuest)
        private completedQuestRepository: Repository<CompletedQuest>,
        private verificationService: VerificationService,
        private userService: UserService,
    ) { }

    async findAllTemplates(): Promise<QuestTemplate[]> {
        return this.questTemplateRepository.find();
    }

    async rollQuest(): Promise<QuestTemplate> {
        const quests = await this.questTemplateRepository.find();
        const randomIndex = Math.floor(Math.random() * quests.length);
        return quests[randomIndex];
    }

    /**
     * Complete quest - creates a PENDING entry awaiting verification
     */
    async completeQuest(userId: string, questId: number, proofVideoUrl: string): Promise<any> {
        try {
            console.log('completeQuest called with:', { userId, questId, proofVideoUrl });

            // Get quest template
            const quest = await this.questTemplateRepository.findOne({ where: { id: questId } });
            if (!quest) {
                return { success: false, message: 'Quest not found' };
            }

            // Create pending completed quest
            const completedQuest = this.completedQuestRepository.create({
                userId,
                questId,
                proofVideoUrl,
                status: 'pending',
                xpAwarded: 0, // Will be set on verification
                goldAwarded: 0,
            });

            await this.completedQuestRepository.save(completedQuest);

            console.log('Quest submitted for verification:', completedQuest.id);

            return {
                success: true,
                message: 'Quest submitted! Awaiting verification...',
                completedQuestId: completedQuest.id,
                status: 'pending',
            };
        } catch (error) {
            console.error('Error completing quest:', error);
            return {
                success: false,
                message: 'Failed to submit quest',
            };
        }
    }

    /**
     * Verify quest - simulates AI verification and awards XP/Gold
     */
    async verifyQuest(completedQuestId: number): Promise<any> {
        try {
            const completedQuest = await this.completedQuestRepository.findOne({
                where: { id: completedQuestId },
                relations: ['quest'],
            });

            if (!completedQuest) {
                return { success: false, message: 'Completed quest not found' };
            }

            if (completedQuest.status !== 'pending') {
                return { success: false, message: 'Quest already verified' };
            }

            // Simulate AI verification (always passes for now)
            const isVerified = true;
            const verificationNotes = 'Simulated verification: Quest proof accepted!';

            if (isVerified) {
                // Get quest XP
                const questXp = completedQuest.quest.xp || 50;
                const questGold = Math.floor(questXp / 2); // Gold = XP / 2

                // Update completed quest
                completedQuest.status = 'verified';
                completedQuest.xpAwarded = questXp;
                completedQuest.goldAwarded = questGold;
                completedQuest.verificationNotes = verificationNotes;
                await this.completedQuestRepository.save(completedQuest);

                // Award XP and Gold to user
                await this.userService.addXP(completedQuest.userId, questXp);
                await this.userService.addGold(completedQuest.userId, questGold);

                console.log(`Quest ${completedQuestId} verified! Awarded ${questXp} XP and ${questGold} Gold`);

                return {
                    success: true,
                    message: 'Quest verified!',
                    xpAwarded: questXp,
                    goldAwarded: questGold,
                };
            } else {
                completedQuest.status = 'rejected';
                completedQuest.verificationNotes = 'Verification failed';
                await this.completedQuestRepository.save(completedQuest);

                return {
                    success: false,
                    message: 'Quest verification failed',
                };
            }
        } catch (error) {
            console.error('Error verifying quest:', error);
            return {
                success: false,
                message: 'Failed to verify quest',
            };
        }
    }

    /**
     * Get all quests for a user
     */
    async getUserQuests(userId: string): Promise<CompletedQuest[]> {
        return this.completedQuestRepository.find({
            where: { userId },
            relations: ['quest'],
            order: { completedAt: 'DESC' },
        });
    }
}
